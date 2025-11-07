/**
 * Note 도메인 타입 정의
 * - 백엔드 Note.java와 1:1 매칭
 * - PostgreSQL 영구 저장 타입
 */

/**
 * Note 도메인 모델
 * - id: 노트 ID (서버 자동 할당)
 * - userId: 사용자 ID
 * - title: 노트 제목 (필수)
 * - content: 노트 본문 (필수, TEXT 타입)
 * - createdAt: 생성 시간 (ISO 8601)
 * - updatedAt: 수정 시간 (ISO 8601)
 */
export interface Note {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Note 생성 요청 DTO
 * - POST /api/notes
 * - title, content: 필수 (빈 값 불가)
 * - images: 미래 확장용 (현재 미사용)
 */
export interface NoteRequest {
  title: string;
  content: string;
  images?: string[];
}

/**
 * Note 응답 DTO
 * - GET /api/notes/{id}
 * - POST /api/notes (생성 후 응답)
 * - PUT /api/notes/{id} (수정 후 응답)
 * - POST /api/notes/from-draft/{noteId} (Draft→Note 변환 후 응답)
 */
export interface NoteResponse {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Note 수정 요청 DTO
 * - PUT /api/notes/{id}
 * - title, content: 선택 (하나만 수정 가능)
 */
export interface NoteUpdateRequest {
  title?: string;
  content?: string;
}
