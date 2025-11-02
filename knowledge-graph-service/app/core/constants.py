"""
애플리케이션 상수 및 기본값
"""

class NoteConfig:
    """노트 CRUD 관련 설정"""
    
    # === 페이지네이션 ===
    DEFAULT_PAGE_LIMIT = 20
    MAX_PAGE_LIMIT = 100
    
    # === 검색 ===
    DEFAULT_SEARCH_LIMIT = 20
    MAX_SEARCH_LIMIT = 100
    
    # === 콘텐츠 ===
    CONTENT_PREVIEW_LENGTH = 200
    
    # === 로깅 ===
    ENABLE_QUERY_LOGGING = True


class ValidationConfig:
    """검증 관련 설정"""
    
    # 제목
    TITLE_MIN_LENGTH = 1
    TITLE_MAX_LENGTH = 500
    
    # 내용
    CONTENT_MIN_LENGTH = 1
    
    # 유사도 점수
    SIMILARITY_SCORE_MIN = 0.0
    SIMILARITY_SCORE_MAX = 1.0


class ErrorConfig:
    """에러 메시지"""
    
    NOTE_NOT_FOUND = "노트를 찾을 수 없습니다"
    INVALID_LIMIT = "limit이 너무 큽니다"
    INVALID_SKIP = "skip은 0 이상이어야 합니다"
