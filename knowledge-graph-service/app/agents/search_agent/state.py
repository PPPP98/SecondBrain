from typing_extensions import Optional, TypedDict, List, Dict


class State(TypedDict, total=False):
    """
    검색 Agent Graph 상태 정의
    ---

    """

    # === 사용자 정보 ===
    user_id: int
    authorizations: str
    # === 입력 ===
    query: str            # 정리된 질문
    original_query: str   # 원본 질문
    # === Pre-Filter ===
    filters: Dict[str, any] 
    # {
        # "timespan": {"start": "ISO", "end": "ISO"},
        # "tags": ["태그1", "태그2"],
        # "exact_title": "정확한 제목",
        # "note_id": "note-12345"
    # }
    is_simple_lookup: bool     # 필터만으로 충분한가?

    # === 라우팅 ===
    search_type: str
    intent: Dict[str, any]

    # === simple lookup ===
    simple_documents: List[Dict]
    simple_top3: List[Dict]

    # === keywords ===
    keywords: List[str]
    es_results: List[Dict]
    kw_documents: List[Dict]
    kw_top3: List[Dict]
    kw_filtered: List[Dict]

    # === similarity ===
    requery: List[str]
    embeddings: List[List[float]]
    avg_embedding: List[float]
    neo4j_vector: List[Dict]
    neo4j_graph: List[Dict]
    deduplicated: List[Dict]
    sim_candidates: List[str]
    sim_documents: List[Dict]
    sim_top3: List[Dict]
    sim_filtered: List[Dict]

    # === result ===
    response: Optional[str]
    sources: List[Dict]