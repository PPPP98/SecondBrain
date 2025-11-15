package com.example.secondbrain.data.model

import com.google.gson.annotations.SerializedName

// AI 에이전트 검색 응답 모델
data class AgentSearchResponse(
    @SerializedName("results")
    val results: List<AgentNoteResult>
)

// 에이전트가 추천하는 개별 노트 데이터
data class AgentNoteResult(
    @SerializedName("id")
    val id: Long,

    @SerializedName("title")
    val title: String,

    @SerializedName("content")
    val content: String,

    @SerializedName("reason")
    val reason: String? = null  // 추천 이유 (선택적)
)
