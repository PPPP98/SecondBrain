package com.example.secondbrain.data.network

import com.example.secondbrain.data.model.ApiResponse
import com.example.secondbrain.data.model.GoogleAuthRequest
import com.example.secondbrain.data.model.Note
import com.example.secondbrain.data.model.TokenResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

// Retrofit API 인터페이스 정의
interface ApiService {

    // Google ID Token을 사용한 인증
    @POST("/api/auth/google")
    suspend fun authenticateWithGoogle(
        @Body request: GoogleAuthRequest
    ): ApiResponse<TokenResponse>

    // 노트 목록 조회
    @GET("/api/notes")
    suspend fun getNotes(): ApiResponse<List<Note>>
}
