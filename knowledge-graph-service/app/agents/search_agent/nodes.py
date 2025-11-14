from datetime import datetime
from .state import State
from .models import Models
from .prompts import Prompts
from .utils.time_utils import get_time_context
from typing import Any

import logging
import asyncio
import json

logger = logging.getLogger(__name__)


class Nodes:
    """
    
    """
    @staticmethod
    async def pre_filter_node(state: State) -> State:
        """
        0단계: Pre-Filter
        
        작업:
        1. 시간 범위 추출
        2. 검색 타입 결정 (simple_lookup | similarity)
        3. 쿼리 재작성 (similarity용, 풍부한 검색)
        """
        
        try:
            logger.debug(f"🔍 Pre-Filter - user: {state.get('user_id')}")
            
            # 시각 정보
            time_context = get_time_context()
            
            # LLM 모델
            models = Models()
            llm = models.get_prefilter_model()
            
            # 프롬프트
            prompt_text = Prompts.PRE_FILTER_PROMPT.format(
                query=state["query"],
                current_datetime=time_context["current_datetime"],
                weekday_korean=time_context["weekday_korean"],
                week_number=time_context["week_number"],
            )
            
            # LLM 호출
            logger.debug(f"💬 분석: {state['query']}")
            result = await llm.ainvoke(prompt_text)
            
            # 필터 구성
            filters = {}
            if result.timespan:
                filters["timespan"] = {
                    "start": result.timespan.start,
                    "end": result.timespan.end,
                    "description": result.timespan.description
                }
                logger.debug(f"📅 시간: {result.timespan.description}")
            
            # 로깅
            logger.debug(f"🔀 타입: {result.search_type}")
            if result.search_type == "similarity" and result.query:
                logger.debug(f"✏️  재작성: {result.query}")
            
            # State 업데이트
            return {
                **state,
                "original_query": state["query"],
                "query": result.query if result.query else state["query"],
                "filters": filters,
                "search_type": result.search_type,
            }
        
        except Exception as e:
            logger.error(f"❌ Pre-filter 에러: {str(e)}")
            import traceback
            traceback.print_exc()
            
            # 기본값: similarity
            return {
                **state,
                "original_query": state.get("query", ""),
                "filters": {},
                "search_type": "similarity",
            }