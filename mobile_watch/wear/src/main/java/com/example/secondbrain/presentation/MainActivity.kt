/* While this template provides a good starting point for using Wear Compose, you can always
 * take a look at https://github.com/android/wear-os-samples/tree/main/ComposeStarter to find the
 * most up to date changes to the libraries and their usages.
 */

package com.example.secondbrain.presentation

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.view.KeyEvent
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.DisposableEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.wear.compose.material.Button
import androidx.wear.compose.material.MaterialTheme
import androidx.wear.compose.material.Text
import androidx.wear.compose.material.TimeText
import androidx.wear.tooling.preview.devices.WearDevices
import com.example.secondbrain.BuildConfig
import com.example.secondbrain.R
import com.example.secondbrain.presentation.theme.SecondBrainTheme
import com.example.secondbrain.wakeword.VoiceRecognitionManager

class MainActivity : ComponentActivity() {

    companion object {
        private const val TAG = "MainActivity"
        private const val DOUBLE_CLICK_TIME_DELTA = 500L
        private const val REQUEST_CODE_SPEECH = 100

        // 디버그 로깅 헬퍼
        private fun logD(message: String) {
            if (BuildConfig.DEBUG) {
                android.util.Log.d(TAG, message)
            }
        }

        private fun logI(message: String) {
            if (BuildConfig.DEBUG) {
                android.util.Log.i(TAG, message)
            }
        }

        private fun logW(message: String) {
            if (BuildConfig.DEBUG) {
                android.util.Log.w(TAG, message)
            }
        }

        private fun logE(message: String, e: Throwable? = null) {
            if (BuildConfig.DEBUG) {
                if (e != null) {
                    android.util.Log.e(TAG, message, e)
                } else {
                    android.util.Log.e(TAG, message)
                }
            }
        }
    }

    private lateinit var voiceRecognitionManager: VoiceRecognitionManager

    // 홈 버튼 더블 클릭 감지를 위한 변수
    private var homeButtonClickCount = 0
    private var lastHomeButtonTime = 0L
    private val homeButtonHandler = Handler(Looper.getMainLooper())
    private val homeButtonRunnable = Runnable {
        homeButtonClickCount = 0
    }

    // 권한 거부 횟수 추적
    private var permissionDeniedCount = 0

    // 온보딩 표시 여부
    private var showOnboarding = true

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        logD("권한 결과: $isGranted")
        if (isGranted) {
            logD("권한 승인됨 - 음성 인식 시작")
            permissionDeniedCount = 0
            startVoiceRecognitionActivity()
        } else {
            permissionDeniedCount++
            logE("권한 거부됨 (${permissionDeniedCount}번째) - 음성 인식 불가")

            if (permissionDeniedCount >= 2) {
                // 두 번 이상 거부시 설정으로 이동 안내
                voiceRecognitionManager.setError("마이크 권한이 필요합니다.\n설정에서 권한을 허용해주세요.")
                showPermissionSettingsDialog()
            } else {
                voiceRecognitionManager.setError("마이크 권한이 필요합니다")
            }
        }
    }

    // 음성 인식 결과를 받기 위한 launcher
    private val speechRecognitionLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        logD("음성 인식 결과 코드: ${result.resultCode}")
        if (result.resultCode == RESULT_OK) {
            val matches = result.data?.getStringArrayListExtra(android.speech.RecognizerIntent.EXTRA_RESULTS)
            if (!matches.isNullOrEmpty()) {
                val recognizedText = matches[0]
                if (recognizedText.isNotBlank()) {
                    logI("✓ 인식 완료 (Activity): '$recognizedText'")
                    voiceRecognitionManager.setRecognizedText(recognizedText)
                } else {
                    logW("인식된 텍스트가 비어있음")
                    voiceRecognitionManager.setError("음성을 인식하지 못했습니다")
                }
            } else {
                logW("인식 결과가 null이거나 비어있음")
                voiceRecognitionManager.setError("음성을 인식하지 못했습니다")
            }
        } else {
            logW("음성 인식 취소 또는 실패")
            voiceRecognitionManager.setError("음성 인식이 취소되었습니다")
        }
        voiceRecognitionManager.setListening(false)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)

        setTheme(android.R.style.Theme_DeviceDefault)

        voiceRecognitionManager = VoiceRecognitionManager(this)

        setContent {
            WearApp(
                voiceRecognitionManager = voiceRecognitionManager,
                showOnboarding = showOnboarding,
                onDismissOnboarding = { showOnboarding = false },
                onStartListening = { checkAndRequestPermission() }
            )
        }
    }

    private fun checkAndRequestPermission() {
        logD("권한 체크 시작...")
        when {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED -> {
                logD("권한 있음 - 음성 인식 Activity 실행")
                startVoiceRecognitionActivity()
            }
            else -> {
                logD("권한 없음 - 권한 요청")
                requestPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
            }
        }
    }

    /**
     * 권한 설정 화면으로 이동
     */
    private fun showPermissionSettingsDialog() {
        try {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                data = Uri.fromParts("package", packageName, null)
            }
            startActivity(intent)
        } catch (e: Exception) {
            logE("설정 화면 열기 실패", e)
        }
    }

    private fun startVoiceRecognitionActivity() {
        try {
            val intent = Intent(android.speech.RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(android.speech.RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                    android.speech.RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(android.speech.RecognizerIntent.EXTRA_LANGUAGE, "ko-KR")
                putExtra(android.speech.RecognizerIntent.EXTRA_PROMPT, "말씀하세요")
                putExtra(android.speech.RecognizerIntent.EXTRA_MAX_RESULTS, 5)
            }

            voiceRecognitionManager.setListening(true)
            voiceRecognitionManager.clearMessages()

            logD("음성 인식 Activity 실행 시도...")
            speechRecognitionLauncher.launch(intent)
        } catch (e: SecurityException) {
            logE("권한 부족으로 음성 인식 실패", e)
            voiceRecognitionManager.setError("마이크 권한이 필요합니다")
            voiceRecognitionManager.setListening(false)
        } catch (e: android.content.ActivityNotFoundException) {
            logE("음성 인식 서비스를 찾을 수 없습니다", e)
            voiceRecognitionManager.setError("음성 인식 서비스가 설치되어 있지 않습니다")
            voiceRecognitionManager.setListening(false)
        } catch (e: Exception) {
            logE("음성 인식 Activity 실행 실패", e)
            voiceRecognitionManager.setError("음성 인식을 시작할 수 없습니다")
            voiceRecognitionManager.setListening(false)
        }
    }

    /**
     * 홈 버튼 더블 클릭을 감지합니다.
     *
     * Note: Wear OS에서 KEYCODE_HOME은 제대로 캐치되지 않을 수 있습니다.
     * 향후 onUserLeaveHint()나 onPause()/onResume() 조합 사용을 고려할 수 있습니다.
     */
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (isHomeButton(keyCode)) {
            val currentTime = System.currentTimeMillis()

            // 더블 클릭 시간 윈도우 체크
            if (currentTime - lastHomeButtonTime < DOUBLE_CLICK_TIME_DELTA) {
                // 두 번째 클릭 - 더블 클릭 감지!
                logD("✓ 홈 버튼 더블 클릭 감지!")
                homeButtonHandler.removeCallbacks(homeButtonRunnable)
                homeButtonClickCount = 0
                lastHomeButtonTime = 0L
                onHomeButtonDoubleClick()
                return true // 이벤트 소비
            } else {
                // 첫 번째 클릭
                logD("홈 버튼 눌림 감지 (첫 클릭)")
                lastHomeButtonTime = currentTime
                homeButtonClickCount = 1
                homeButtonHandler.postDelayed(homeButtonRunnable, DOUBLE_CLICK_TIME_DELTA)
                return super.onKeyDown(keyCode, event)
            }
        }

        return super.onKeyDown(keyCode, event)
    }

    /**
     * 홈 버튼 키 코드 체크
     * KEYCODE_STEM_PRIMARY: Wear OS의 물리적 버튼
     */
    private fun isHomeButton(keyCode: Int): Boolean {
        return keyCode == KeyEvent.KEYCODE_STEM_PRIMARY
    }

    private fun onHomeButtonDoubleClick() {
        logD("음성 인식 시작 (홈 버튼 더블 클릭)")
        checkAndRequestPermission()
    }

    override fun onPause() {
        super.onPause()
        logD("Activity paused - 음성 인식 정리")
        // 백그라운드로 갈 때 음성 인식 리소스 해제
        if (voiceRecognitionManager.isCurrentlyListening()) {
            voiceRecognitionManager.stopListening()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        logD("Activity 종료 - 리소스 정리 중")

        // Handler 콜백 제거
        homeButtonHandler.removeCallbacks(homeButtonRunnable)

        // 음성 인식 리소스 정리
        voiceRecognitionManager.cleanup()
    }
}

@Composable
fun WearApp(
    voiceRecognitionManager: VoiceRecognitionManager,
    showOnboarding: Boolean,
    onDismissOnboarding: () -> Unit,
    onStartListening: () -> Unit
) {
    val recognizedText by voiceRecognitionManager.recognizedText.collectAsState()
    val isListening by voiceRecognitionManager.isListening.collectAsState()
    val errorMessage by voiceRecognitionManager.errorMessage.collectAsState()
    var showHelp by remember { mutableStateOf(showOnboarding) }

    SecondBrainTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colors.background),
            contentAlignment = Alignment.Center
        ) {
            TimeText()

            if (showHelp) {
                // 온보딩/도움말 화면
                OnboardingScreen(
                    onDismiss = {
                        showHelp = false
                        onDismissOnboarding()
                    }
                )
            } else {
                // 메인 화면
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = if (isListening) "듣는 중..." else "음성 인식",
                        style = MaterialTheme.typography.title3,
                        color = if (isListening) MaterialTheme.colors.primary else MaterialTheme.colors.onBackground,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    if (recognizedText.isNotEmpty()) {
                        Text(
                            text = recognizedText,
                            style = MaterialTheme.typography.body2,
                            color = MaterialTheme.colors.onBackground,
                            textAlign = TextAlign.Center
                        )
                    }

                    if (errorMessage.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = errorMessage,
                            style = MaterialTheme.typography.caption1,
                            color = MaterialTheme.colors.error,
                            textAlign = TextAlign.Center
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            if (isListening) {
                                voiceRecognitionManager.stopListening()
                            } else {
                                onStartListening()
                            }
                        },
                        enabled = !isListening || errorMessage.isEmpty()
                    ) {
                        Text(if (isListening) "중지" else "말하기")
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = if (isListening) "🎤 음성 인식 중" else "홈 버튼 2번 클릭\n또는 '말하기' 버튼",
                        style = MaterialTheme.typography.caption1,
                        color = MaterialTheme.colors.onBackground,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // 도움말 버튼
                    Button(
                        onClick = { showHelp = true },
                        modifier = Modifier.padding(top = 8.dp)
                    ) {
                        Text("?")
                    }
                }
            }
        }
    }
}

@Composable
fun OnboardingScreen(onDismiss: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "사용 방법",
            style = MaterialTheme.typography.title3,
            color = MaterialTheme.colors.primary,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "음성 인식 시작하기:",
            style = MaterialTheme.typography.body2,
            color = MaterialTheme.colors.onBackground,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "1. 홈 버튼 2번 빠르게 클릭\n또는\n2. '말하기' 버튼 누르기",
            style = MaterialTheme.typography.caption1,
            color = MaterialTheme.colors.onBackground,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "💡 팁: 조용한 환경에서 사용하면 인식률이 높아집니다",
            style = MaterialTheme.typography.caption1,
            color = MaterialTheme.colors.onBackground.copy(alpha = 0.7f),
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = onDismiss
        ) {
            Text("시작하기")
        }
    }
}