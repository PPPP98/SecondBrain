package com.example.secondbrain.ui.login

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.secondbrain.MainActivity
import com.example.secondbrain.R
import com.example.secondbrain.data.local.TokenManager
import com.example.secondbrain.data.model.GoogleAuthRequest
import com.example.secondbrain.data.network.RetrofitClient
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.SignInButton
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task
import kotlinx.coroutines.launch

// 임시 로그인 화면
// TODO: 예나가 추후 UI/UX 개선 예정
class LoginActivity : AppCompatActivity() {

    // Google Sign-In Client
    private lateinit var googleSignInClient: GoogleSignInClient

    // Token Manager
    private lateinit var tokenManager: TokenManager

    // UI 컴포넌트
    private lateinit var btnGoogleSignIn: SignInButton
    private lateinit var progressBar: ProgressBar
    private lateinit var tvError: TextView

    // Google Sign-In Activity Result Launcher
    private val signInLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
        handleSignInResult(task)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // TokenManager 초기화
        tokenManager = TokenManager(this)

        // UI 초기화
        btnGoogleSignIn = findViewById(R.id.btnGoogleSignIn)
        progressBar = findViewById(R.id.progressBar)
        tvError = findViewById(R.id.tvError)

        // Google Sign-In 옵션 설정
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken("") // TODO: 혜성으로부터 Android OAuth Client ID 받아서 입력 필요
            .requestEmail()
            .build()

        // Google Sign-In Client 생성
        googleSignInClient = GoogleSignIn.getClient(this, gso)

        // Google 로그인 버튼 클릭 리스너
        btnGoogleSignIn.setOnClickListener {
            signIn()
        }
    }

    // Google Sign-In 시작
    private fun signIn() {
        // 기존 계정 로그아웃 (새로운 계정 선택 가능)
        googleSignInClient.signOut().addOnCompleteListener {
            val signInIntent = googleSignInClient.signInIntent
            signInLauncher.launch(signInIntent)
        }
    }

    // Google Sign-In 결과 처리
    private fun handleSignInResult(completedTask: Task<GoogleSignInAccount>) {
        try {
            val account = completedTask.getResult(ApiException::class.java)
            val idToken = account?.idToken

            if (idToken != null) {
                // Google ID Token을 백엔드로 전송
                authenticateWithBackend(idToken)
            } else {
                showError("ID Token을 가져올 수 없습니다")
            }
        } catch (e: ApiException) {
            showError("로그인 실패: ${e.message}")
        }
    }

    // 백엔드로 Google ID Token 전송 및 JWT 토큰 획득
    private fun authenticateWithBackend(idToken: String) {
        showLoading(true)

        lifecycleScope.launch {
            try {
                // API Service 생성
                val apiService = RetrofitClient.createApiService { tokenManager.getAccessToken() }

                // Google ID Token을 백엔드로 전송
                val request = GoogleAuthRequest(idToken)
                val response = apiService.authenticateWithGoogle(request)

                if (response.code == 200 && response.data != null) {
                    // JWT 토큰 저장
                    tokenManager.saveAccessToken(
                        token = response.data.accessToken,
                        tokenType = response.data.tokenType
                    )

                    // MainActivity로 이동
                    navigateToMain()
                } else {
                    showError("인증 실패: ${response.message}")
                }
            } catch (e: Exception) {
                showError("네트워크 오류: ${e.message}")
            } finally {
                showLoading(false)
            }
        }
    }

    // MainActivity로 이동
    private fun navigateToMain() {
        val intent = Intent(this, MainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }

    // 로딩 상태 표시
    private fun showLoading(isLoading: Boolean) {
        progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        btnGoogleSignIn.isEnabled = !isLoading
    }

    // 에러 메시지 표시
    private fun showError(message: String) {
        tvError.text = message
        tvError.visibility = View.VISIBLE
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}
