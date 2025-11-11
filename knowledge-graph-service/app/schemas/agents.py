from pydantic import BaseModel, Field
from typing import List


class LLMResponse(BaseModel):
    """
    LLM 응답 스키마
    - title: 노트 제목
    - result: 요약된 텍스트
    """
    title: str = Field(..., description="노트 제목")
    result: str = Field(..., description="요약된 텍스트")