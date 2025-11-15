package com.example.secondbrain

import android.app.Application
import android.util.Log
import com.google.android.gms.wearable.Wearable
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

/**
 * Application 클래스
 * 앱 시작 시 WearableListenerService 바인딩 트리거
 */
class SecondBrainApplication : Application() {

    companion object {
        private const val TAG = "SecondBrainApp"
    }

    private val applicationScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    override fun onCreate() {
        super.onCreate()
        Log.i(TAG, "Application onCreate - 앱 시작")

        // WearableListenerService 바인딩 트리거
        initializeWearableService()
    }

    private fun initializeWearableService() {
        applicationScope.launch {
            try {
                Log.i(TAG, "=========================================")
                Log.i(TAG, "WearableListenerService 초기화 시작")
                Log.i(TAG, "=========================================")

                // Google Play Services 버전 확인
                try {
                    val gmsVersion = com.google.android.gms.common.GoogleApiAvailability.getInstance()
                        .isGooglePlayServicesAvailable(this@SecondBrainApplication)
                    Log.i(TAG, "Google Play Services 상태: $gmsVersion (0이면 정상)")
                } catch (e: Exception) {
                    Log.e(TAG, "Google Play Services 확인 실패", e)
                }

                // DataClient 생성 및 수동 리스너 등록
                Log.i(TAG, "DataClient 생성 및 리스너 등록 중...")
                val dataClient = Wearable.getDataClient(this@SecondBrainApplication)

                // 수동으로 DataListener 등록
                val dataListener = com.google.android.gms.wearable.DataClient.OnDataChangedListener { dataEvents ->
                    Log.i(TAG, "🔥 DataListener 호출됨! ${dataEvents.count}개 데이터 수신")

                    for (event in dataEvents) {
                        if (event.type == com.google.android.gms.wearable.DataEvent.TYPE_CHANGED) {
                            val dataItem = event.dataItem
                            Log.i(TAG, "DataItem 경로: ${dataItem.uri.path}")

                            when (dataItem.uri.path) {
                                "/voice_text" -> {
                                    val dataMap = com.google.android.gms.wearable.DataMapItem.fromDataItem(dataItem).dataMap
                                    val recognizedText = dataMap.getString("text") ?: ""
                                    val timestamp = dataMap.getLong("timestamp", 0L)

                                    Log.i(TAG, "✓ 음성 텍스트 수신: '$recognizedText' (timestamp: $timestamp)")

                                    // MobileWearableListenerService의 sendToBackend 호출
                                    applicationScope.launch {
                                        // TODO: 백엔드 전송 로직
                                        Log.i(TAG, "백엔드로 전송할 텍스트: $recognizedText")
                                    }
                                }
                                else -> {
                                    Log.w(TAG, "알 수 없는 경로: ${dataItem.uri.path}")
                                }
                            }
                        }
                    }
                }

                dataClient.addListener(dataListener)
                Log.i(TAG, "✓ DataListener 수동 등록 완료!")

                Log.i(TAG, "=========================================")
                Log.i(TAG, "Data Layer 리스너 등록 완료!")
                Log.i(TAG, "이제 워치에서 데이터를 전송하면 여기서 수신합니다")
                Log.i(TAG, "=========================================")

            } catch (e: Exception) {
                Log.e(TAG, "❌ WearableListenerService 초기화 실패", e)
                Log.e(TAG, "스택 트레이스:", e)
            }
        }
    }
}
