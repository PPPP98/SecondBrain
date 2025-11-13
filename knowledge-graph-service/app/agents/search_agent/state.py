from typing_extensions import TypedDict, List

class State(TypedDict):
    """
    검색 Agent Graph 상태 정의
    ---
    ### query
    - 사용자가 입력한 검색어
    ### re_query
    - 재구성된 검색어
    ### key_word
    - 추출된 핵심 키워드 리스트
    ### search_type
    - 검색 유형 (예: 'keyword', 'vector', 'hybrid')
    ### search_result
    - 검색된 결과의 노드 ID 리스트
    ### timespan
    - 검색 기간 필터
    ### result
    - 최종 선택된 결과의 노드 ID 리스트
    ### response
    - 최종 응답 텍스트

    """
    query: str
    re_query: str
    key_word: List[str]
    search_type: str
    search_result: List[int]
    timespan: str
    result: List[int]
    response: str