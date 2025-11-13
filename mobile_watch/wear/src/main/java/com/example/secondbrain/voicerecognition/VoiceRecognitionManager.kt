package com.example.secondbrain.voicerecognition

import android.content.Context
import android.speech.SpeechRecognizer
import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

/**
 * 음성 인식 상태 관리 매니저
 *
 * Wear OS에서는 Activity 기반 음성 인식만 사용
 * 이 클래스는 UI 상태 관리만 담당
 */
class VoiceRecognitionManager(private val context: Context) {

    companion object {
        private const val TAG = "VoiceRecognitionMgr"
    }

    private val _isListening = MutableStateFlow(false)
    val isListening: StateFlow<Boolean> = _isListening

    private val _recognizedText = MutableStateFlow("")
    val recognizedText: StateFlow<String> = _recognizedText

    private val _errorMessage = MutableStateFlow("")
    val errorMessage: StateFlow<String> = _errorMessage

    init {
        if (!SpeechRecognizer.isRecognitionAvailable(context)) {
            Log.e(TAG, "음성 인식 사용 불가")
            _errorMessage.value = "음성 인식 사용 불가"
        } else {
            Log.d(TAG, "음성 인식 사용 가능")
        }
    }

    fun isCurrentlyListening(): Boolean = _isListening.value

    fun setListening(listening: Boolean) {
        _isListening.value = listening
    }

    fun setRecognizedText(text: String) {
        if (text.isNotBlank()) {
            _recognizedText.value = text
            Log.d(TAG, "인식 결과: $text")
        }
    }

    fun setError(error: String) {
        _errorMessage.value = error
        Log.w(TAG, "에러: $error")
    }

    fun clearMessages() {
        _recognizedText.value = ""
        _errorMessage.value = ""
    }

    fun stopListening() {
        _isListening.value = false
    }

    fun cleanup() {
        stopListening()
    }
}
