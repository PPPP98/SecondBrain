package com.example.secondbrain.ui.search

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.speech.RecognizerIntent
import android.view.View
import android.view.WindowManager
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
import com.example.secondbrain.data.model.AgentNoteResult
import com.example.secondbrain.data.model.AgentSearchResponse
import com.example.secondbrain.data.model.NoteSearchResult
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
    private lateinit var tvAgentLoading: TextView
    private lateinit var tvAgentResponse: TextView
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

        // userId를 코루틴에서 가져오기
        lifecycleScope.launch {
            userId = tokenManager.getUserId() ?: -1

            if (userId == -1L) {
                Toast.makeText(this@SearchActivity, "사용자 정보를 찾을 수 없습니다", Toast.LENGTH_SHORT).show()
                finish()
                return@launch
            }

            initializeViews()
            setupRecyclerViews()
            setupListeners()

            // 워치에서 전달된 검색 결과 처리
            if (intent.getBooleanExtra("FROM_WEARABLE", false)) {
                handleWearableSearchResult()
            }
            // 워치 알림에서 Deep Link로 실행된 경우
            else if (intent.action == Intent.ACTION_VIEW && intent.data != null) {
                handleDeepLink()
            }
            // 웨이크워드로 실행된 경우 자동으로 STT 시작
            else if (intent.getBooleanExtra("auto_start_stt", false)) {
                android.util.Log.d("SearchActivity", "웨이크워드 감지로 실행됨 - STT 자동 시작")
                // UI가 완전히 준비된 후 STT 시작
                btnVoiceSearch.postDelayed({
                    checkMicPermissionAndStartVoice()
                }, 500)
            }
        }
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
        tvAgentLoading = findViewById(R.id.tvAgentLoading)
        tvAgentResponse = findViewById(R.id.tvAgentResponse)
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
            // 한국어로 명시적 설정
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "ko-KR")
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "ko-KR")
            putExtra(RecognizerIntent.EXTRA_ONLY_RETURN_LANGUAGE_PREFERENCE, "ko-KR")
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
                // TokenManager에서 토큰 가져오기
                val apiService = RetrofitClient.createApiService { tokenManager.getAccessToken() }
                val fastApiService = RetrofitClient.createFastApiService { tokenManager.getAccessToken() }

                // 병렬 API 호출 (각각 독립적으로 실행)
                launch {
                    // ElasticSearch 결과 처리
                    try {
                        val apiResponse = apiService.searchNotes(query)
                        apiResponse.data?.let { searchResponse ->
                            displayElasticResults(searchResponse.results)
                        }
                    } catch (e: Exception) {
                        android.util.Log.e("SearchActivity", "ElasticSearch 실패: ${e.message}", e)
                        tvError.text = "검색 실패: ${e.message}"
                        tvError.visibility = View.VISIBLE
                    } finally {
                        progressBar.visibility = View.GONE
                    }
                }

                launch {
                    // AI Agent 결과 처리 (독립적)
                    try {
                        // AI 로딩 상태 표시
                        showAgentLoading()

                        val agentResponse = fastApiService.searchWithAgent(query, userId)

                        // 로딩 상태 숨기고 결과 표시
                        hideAgentLoading()
                        displayAgentResults(agentResponse.response, agentResponse.documents ?: emptyList())
                    } catch (e: Exception) {
                        android.util.Log.e("SearchActivity", "Agent 검색 실패: ${e.message}", e)
                        hideAgentLoading()
                        // Agent 실패는 조용히 처리 (선택적 기능)
                    }
                }

            } catch (e: Exception) {
                android.util.Log.e("SearchActivity", "검색 중 오류: ${e.message}", e)
                progressBar.visibility = View.GONE
                tvError.text = "검색 중 오류 발생: ${e.message}"
                tvError.visibility = View.VISIBLE
            }
        }
    }

    private fun displayElasticResults(results: List<NoteSearchResult>) {
        runOnUiThread {
            android.util.Log.d("SearchActivity", "displayElasticResults 호출: ${results.size}개")
            android.util.Log.d("SearchActivity", "첫 번째 결과: ${results.firstOrNull()?.title}")
            if (results.isNotEmpty()) {
                tvResultsTitle.visibility = View.VISIBLE
                tvElasticTitle.visibility = View.VISIBLE
                rvElasticResults.visibility = View.VISIBLE
                elasticAdapter.updateResults(results)
                rvElasticResults.post {
                    android.util.Log.d("SearchActivity", "어댑터 itemCount: ${elasticAdapter.itemCount}")
                    android.util.Log.d("SearchActivity", "RecyclerView visibility: ${rvElasticResults.visibility}")
                    android.util.Log.d("SearchActivity", "RecyclerView height: ${rvElasticResults.height}")
                    android.util.Log.d("SearchActivity", "RecyclerView childCount: ${rvElasticResults.childCount}")
                }
                android.util.Log.d("SearchActivity", "ElasticSearch 결과 화면에 표시 완료")
            } else {
                android.util.Log.d("SearchActivity", "ElasticSearch 결과가 비어있음")
            }
        }
    }

    private fun showAgentLoading() {
        runOnUiThread {
            tvResultsTitle.visibility = View.VISIBLE
            tvAgentTitle.visibility = View.VISIBLE
            tvAgentLoading.visibility = View.VISIBLE
        }
    }

    private fun hideAgentLoading() {
        runOnUiThread {
            tvAgentLoading.visibility = View.GONE
        }
    }

    private fun displayAgentResults(responseMessage: String, results: List<AgentNoteResult>) {
        runOnUiThread {
            android.util.Log.d("SearchActivity", "displayAgentResults 호출: 메시지='$responseMessage', 결과=${results.size}개")

            // AI 응답 메시지는 항상 표시
            if (responseMessage.isNotEmpty()) {
                tvResultsTitle.visibility = View.VISIBLE
                tvAgentTitle.visibility = View.VISIBLE
                tvAgentResponse.visibility = View.VISIBLE
                tvAgentResponse.text = responseMessage
            }

            // 노트 결과가 있으면 RecyclerView 표시
            if (results.isNotEmpty()) {
                rvAgentResults.visibility = View.VISIBLE
                agentAdapter.submitList(results.toList())
                android.util.Log.d("SearchActivity", "Agent 노트 결과 ${results.size}개 화면에 표시 완료")
            } else {
                android.util.Log.d("SearchActivity", "Agent 노트 결과가 비어있음 (메시지만 표시)")
            }
        }
    }

    private fun hideAllResults() {
        tvResultsTitle.visibility = View.GONE
        tvElasticTitle.visibility = View.GONE
        tvAgentTitle.visibility = View.GONE
        tvAgentLoading.visibility = View.GONE
        tvAgentResponse.visibility = View.GONE
        rvElasticResults.visibility = View.GONE
        rvAgentResults.visibility = View.GONE
        tvNoResults.visibility = View.GONE
    }

    /**
     * 워치에서 전달된 검색 결과 처리
     */
    private fun handleWearableSearchResult() {
        try {
            // 화면 켜기 및 잠금 화면 위에 표시
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                setShowWhenLocked(true)
                setTurnScreenOn(true)
            } else {
                @Suppress("DEPRECATION")
                window.addFlags(
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                )
            }

            val query = intent.getStringExtra("SEARCH_QUERY") ?: ""
            val responseMessage = intent.getStringExtra("SEARCH_RESPONSE") ?: ""
            val searchResult = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                intent.getSerializableExtra("SEARCH_RESULT", AgentSearchResponse::class.java)
            } else {
                @Suppress("DEPRECATION")
                intent.getSerializableExtra("SEARCH_RESULT") as? AgentSearchResponse
            }

            android.util.Log.d("SearchActivity", "워치 검색 결과 수신: query='$query', response='$responseMessage'")

            // 검색어를 입력창에 표시
            etSearchQuery.setText(query)

            // 결과 표시
            hideAllResults()

            if (searchResult != null) {
                displayAgentResults(
                    searchResult.response,
                    searchResult.documents ?: emptyList()
                )
                android.util.Log.d("SearchActivity", "워치 검색 결과 표시 완료: ${searchResult.documents?.size ?: 0}개 노트")
            } else {
                // 검색 결과가 없는 경우 메시지만 표시
                tvResultsTitle.visibility = View.VISIBLE
                tvAgentTitle.visibility = View.VISIBLE
                tvAgentResponse.visibility = View.VISIBLE
                tvAgentResponse.text = responseMessage
                android.util.Log.d("SearchActivity", "워치 검색 메시지만 표시: $responseMessage")
            }

        } catch (e: Exception) {
            android.util.Log.e("SearchActivity", "워치 검색 결과 처리 실패", e)
            Toast.makeText(this, "검색 결과를 표시할 수 없습니다", Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * 워치 알림에서 Deep Link로 열렸을 때 처리
     * URI: secondbrain://search?message=<응답 메시지>
     */
    private fun handleDeepLink() {
        try {
            val uri = intent.data
            android.util.Log.d("SearchActivity", "Deep Link 수신: $uri")

            // 화면 켜기 및 잠금 화면 위에 표시
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                setShowWhenLocked(true)
                setTurnScreenOn(true)
            } else {
                @Suppress("DEPRECATION")
                window.addFlags(
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                )
            }

            if (uri?.scheme == "secondbrain" && uri.host == "search") {
                val message = uri.getQueryParameter("message")
                android.util.Log.d("SearchActivity", "Deep Link 메시지: '$message'")

                // 결과 표시
                hideAllResults()

                if (!message.isNullOrBlank()) {
                    tvResultsTitle.visibility = View.VISIBLE
                    tvAgentTitle.visibility = View.VISIBLE
                    tvAgentResponse.visibility = View.VISIBLE
                    tvAgentResponse.text = message
                    android.util.Log.d("SearchActivity", "Deep Link 메시지 표시 완료")
                }
            } else {
                android.util.Log.w("SearchActivity", "알 수 없는 Deep Link: $uri")
            }

        } catch (e: Exception) {
            android.util.Log.e("SearchActivity", "Deep Link 처리 실패", e)
            Toast.makeText(this, "알림을 열 수 없습니다", Toast.LENGTH_SHORT).show()
        }
    }

    private fun navigateToNoteDetail(noteId: Long) {
        val intent = Intent(this, NoteDetailActivity::class.java).apply {
            putExtra("NOTE_ID", noteId)
        }
        startActivity(intent)
    }
}
