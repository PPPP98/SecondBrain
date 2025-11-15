package com.example.secondbrain.ui.search

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.speech.RecognizerIntent
import android.view.View
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.secondbrain.R
import com.example.secondbrain.data.local.TokenManager
import com.example.secondbrain.data.network.RetrofitClient
import com.example.secondbrain.ui.note.NoteDetailActivity
import kotlinx.coroutines.async
import kotlinx.coroutines.launch
import java.util.Locale

/**
 * 음성 및 텍스트 검색 화면
 * - 텍스트 검색 및 STT(음성) 검색 지원
 * - ElasticSearch와 FastAPI Agent를 병렬로 호출
 * - ElasticSearch 결과를 먼저 표시하고, Agent 결과가 오면 추가 표시
 */
class SearchActivity : AppCompatActivity() {

    // UI 컴포넌트
    private lateinit var etSearchQuery: EditText
    private lateinit var btnVoiceSearch: ImageButton
    private lateinit var btnSearch: ImageButton
    private lateinit var tvVoiceStatus: TextView
    private lateinit var progressBar: ProgressBar
    private lateinit var tvResultsTitle: TextView
    private lateinit var tvElasticTitle: TextView
    private lateinit var tvAgentTitle: TextView
    private lateinit var rvElasticResults: RecyclerView
    private lateinit var rvAgentResults: RecyclerView
    private lateinit var tvNoResults: TextView
    private lateinit var tvError: TextView

    // 어댑터
    private lateinit var elasticAdapter: SearchResultAdapter
    private lateinit var agentAdapter: AgentResultAdapter

    // 데이터
    private lateinit var tokenManager: TokenManager
    private var userId: Long = -1

    // 음성 인식 결과 처리
    private val speechRecognizerLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        tvVoiceStatus.visibility = View.GONE

        if (result.resultCode == RESULT_OK) {
            val matches = result.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
            if (!matches.isNullOrEmpty()) {
                val recognizedText = matches[0]
                etSearchQuery.setText(recognizedText)
                performSearch(recognizedText)
            }
        } else {
            Toast.makeText(this, "음성 인식 실패", Toast.LENGTH_SHORT).show()
        }
    }

    // 마이크 권한 요청
    private val requestMicPermission = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            startVoiceRecognition()
        } else {
            Toast.makeText(this, "마이크 권한이 필요합니다", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_search)

        tokenManager = TokenManager(this)
        userId = tokenManager.getUserId() ?: -1

        if (userId == -1L) {
            Toast.makeText(this, "사용자 정보를 찾을 수 없습니다", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        initializeViews()
        setupRecyclerViews()
        setupListeners()
    }

    private fun initializeViews() {
        etSearchQuery = findViewById(R.id.etSearchQuery)
        btnVoiceSearch = findViewById(R.id.btnVoiceSearch)
        btnSearch = findViewById(R.id.btnSearch)
        tvVoiceStatus = findViewById(R.id.tvVoiceStatus)
        progressBar = findViewById(R.id.progressBar)
        tvResultsTitle = findViewById(R.id.tvResultsTitle)
        tvElasticTitle = findViewById(R.id.tvElasticTitle)
        tvAgentTitle = findViewById(R.id.tvAgentTitle)
        rvElasticResults = findViewById(R.id.rvElasticResults)
        rvAgentResults = findViewById(R.id.rvAgentResults)
        tvNoResults = findViewById(R.id.tvNoResults)
        tvError = findViewById(R.id.tvError)
    }

    private fun setupRecyclerViews() {
        // ElasticSearch 결과 어댑터
        elasticAdapter = SearchResultAdapter { noteId ->
            navigateToNoteDetail(noteId)
        }
        rvElasticResults.apply {
            layoutManager = LinearLayoutManager(this@SearchActivity)
            adapter = elasticAdapter
        }

        // AI Agent 결과 어댑터
        agentAdapter = AgentResultAdapter { noteId ->
            navigateToNoteDetail(noteId)
        }
        rvAgentResults.apply {
            layoutManager = LinearLayoutManager(this@SearchActivity)
            adapter = agentAdapter
        }
    }

    private fun setupListeners() {
        btnSearch.setOnClickListener {
            val query = etSearchQuery.text.toString().trim()
            if (query.isNotEmpty()) {
                performSearch(query)
            } else {
                Toast.makeText(this, "검색어를 입력하세요", Toast.LENGTH_SHORT).show()
            }
        }

        btnVoiceSearch.setOnClickListener {
            checkMicPermissionAndStartVoice()
        }

        // Enter 키로 검색
        etSearchQuery.setOnEditorActionListener { _, _, _ ->
            val query = etSearchQuery.text.toString().trim()
            if (query.isNotEmpty()) {
                performSearch(query)
                true
            } else {
                false
            }
        }
    }

    private fun checkMicPermissionAndStartVoice() {
        when {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED -> {
                startVoiceRecognition()
            }
            else -> {
                requestMicPermission.launch(Manifest.permission.RECORD_AUDIO)
            }
        }
    }

    private fun startVoiceRecognition() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(
                RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM
            )
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.KOREAN)
            putExtra(RecognizerIntent.EXTRA_PROMPT, "검색어를 말씀하세요")
        }

        try {
            tvVoiceStatus.visibility = View.VISIBLE
            speechRecognizerLauncher.launch(intent)
        } catch (e: Exception) {
            tvVoiceStatus.visibility = View.GONE
            Toast.makeText(this, "음성 인식을 시작할 수 없습니다", Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * 병렬 검색 실행
     * 1. ElasticSearch (SpringBoot)와 AI Agent (FastAPI)를 동시에 호출
     * 2. ElasticSearch 결과를 먼저 표시
     * 3. AI Agent 결과가 오면 비동기로 추가 표시
     */
    private fun performSearch(query: String) {
        hideAllResults()
        progressBar.visibility = View.VISIBLE
        tvError.visibility = View.GONE

        lifecycleScope.launch {
            try {
                val apiService = RetrofitClient.apiService
                val fastApiService = RetrofitClient.fastApiService

                // 병렬 API 호출
                val elasticDeferred = async {
                    apiService.searchNotes(query)
                }

                val agentDeferred = async {
                    fastApiService.searchWithAgent(query, userId)
                }

                // ElasticSearch 결과를 먼저 처리
                try {
                    val elasticResponse = elasticDeferred.await()
                    displayElasticResults(elasticResponse.results)
                } catch (e: Exception) {
                    tvError.text = "검색 실패: ${e.message}"
                    tvError.visibility = View.VISIBLE
                }

                // AI Agent 결과를 비동기로 처리
                try {
                    val agentResponse = agentDeferred.await()
                    displayAgentResults(agentResponse.results)
                } catch (e: Exception) {
                    // Agent 실패는 조용히 처리 (선택적 기능)
                    tvAgentTitle.text = "AI 추천 결과 (로딩 실패)"
                }

                progressBar.visibility = View.GONE

                // 둘 다 결과가 없으면 "결과 없음" 표시
                if (elasticAdapter.itemCount == 0 && agentAdapter.itemCount == 0) {
                    tvNoResults.visibility = View.VISIBLE
                }

            } catch (e: Exception) {
                progressBar.visibility = View.GONE
                tvError.text = "검색 중 오류 발생: ${e.message}"
                tvError.visibility = View.VISIBLE
            }
        }
    }

    private fun displayElasticResults(results: List<com.example.secondbrain.data.model.NoteSearchResult>) {
        if (results.isNotEmpty()) {
            tvResultsTitle.visibility = View.VISIBLE
            tvElasticTitle.visibility = View.VISIBLE
            rvElasticResults.visibility = View.VISIBLE
            elasticAdapter.submitList(results)
        }
    }

    private fun displayAgentResults(results: List<com.example.secondbrain.data.model.AgentNoteResult>) {
        if (results.isNotEmpty()) {
            tvResultsTitle.visibility = View.VISIBLE
            tvAgentTitle.visibility = View.VISIBLE
            rvAgentResults.visibility = View.VISIBLE
            agentAdapter.submitList(results)
        }
    }

    private fun hideAllResults() {
        tvResultsTitle.visibility = View.GONE
        tvElasticTitle.visibility = View.GONE
        tvAgentTitle.visibility = View.GONE
        rvElasticResults.visibility = View.GONE
        rvAgentResults.visibility = View.GONE
        tvNoResults.visibility = View.GONE
    }

    private fun navigateToNoteDetail(noteId: Long) {
        val intent = Intent(this, NoteDetailActivity::class.java).apply {
            putExtra("NOTE_ID", noteId)
        }
        startActivity(intent)
    }
}
