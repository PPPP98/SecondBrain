package com.example.secondbrain.data.network

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

// Retrofit 클라이언트 싱글톤 객체
object RetrofitClient {

    // 백엔드 서버 URL
    private const val BASE_URL = "https://brainsecond.site/"

    // HTTP 로깅 인터셉터 (디버그용)
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    // OkHttpClient 생성 함수 (토큰 제공자를 받음)
    private fun createOkHttpClient(tokenProvider: suspend () -> String?): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor) // HTTP 로그 출력
            .addInterceptor(AuthInterceptor(tokenProvider)) // JWT 자동 추가
            .connectTimeout(30, TimeUnit.SECONDS) // 연결 타임아웃
            .readTimeout(30, TimeUnit.SECONDS) // 읽기 타임아웃
            .writeTimeout(30, TimeUnit.SECONDS) // 쓰기 타임아웃
            .build()
    }

    // Retrofit 인스턴스 생성 함수
    fun createApiService(tokenProvider: suspend () -> String?): ApiService {
        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(createOkHttpClient(tokenProvider))
            .addConverterFactory(GsonConverterFactory.create()) // JSON 변환
            .build()
            .create(ApiService::class.java)
    }
}
