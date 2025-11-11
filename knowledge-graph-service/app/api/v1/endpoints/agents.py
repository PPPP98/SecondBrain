from fastapi import APIRouter, Header, HTTPException, Query
from typing import Optional, List
import logging
import requests

from app.services.note_summarize_service import note_summarize_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/agents", tags=["agents"])

# --- request help func ---
def call_external_service(url: str, auth_token: str, payload)-> Optional[dict]:
    headers = {
        "Authorization": auth_token,
    }



@router.post(
    "/summarize",
    summary="요약",
    description="url, text 데이터 LLM을 활용해서 요약 저장",
)
async def note_summarize(
    data: List[str],
    authorization: Optional[str] = Header(None),
):
    if not authorization:
        raise HTTPException(status_code=401, detail="JWT missing")
    
    result = await note_summarize_service.get_note_summarize(data)

    if not result:
        raise HTTPException(status_code=400, detail="empty data")
    
    return {"result": result}

