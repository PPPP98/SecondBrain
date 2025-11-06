import { apiClient } from '@/api/client';
import type {
  NoteDraftRequest,
  NoteDraftResponse,
  NoteDraftListResponse,
} from '@/shared/types/draft.types';

const API_BASE_URL = '/api/drafts';

/**
 * API 응답 래퍼 타입
 * - 백엔드 BaseResponse와 일치
 */
interface ApiResponse<Result> {
  success: boolean;
  code: number;
  message: string;
  data: Result;
}

/**
 * TanStack Query용 QueryKey 팩토리
 * - 일관된 쿼리 키 관리
 * - 타입 안전성 보장
 */
export const draftQueries = {
  all: ['drafts'] as const,
  lists: () => [...draftQueries.all, 'list'] as const,
  list: () => [...draftQueries.lists()] as const,
  details: () => [...draftQueries.all, 'detail'] as const,
  detail: (id: string) => [...draftQueries.details(), id] as const,
};

/**
 * Draft 저장 (POST /api/drafts)
 *
 * 동작:
 * - 신규: noteId가 없으면 서버가 UUID 생성
 * - 기존: noteId가 있으면 업데이트 (version 자동 증가)
 *
 * 검증:
 * - title OR content 중 하나만 있어도 저장 가능
 * - version 충돌 시 409 Conflict 응답
 *
 * @param data - Draft 저장 요청 데이터
 * @returns 저장된 Draft 정보 (version 포함)
 * @throws Error - 저장 실패 시
 */
export async function saveDraft(data: NoteDraftRequest): Promise<NoteDraftResponse> {
  const response = await apiClient.post<ApiResponse<NoteDraftResponse>>(API_BASE_URL, data);
  return response.data.data;
}

/**
 * Draft 조회 (GET /api/drafts/{noteId})
 *
 * @param noteId - Draft UUID
 * @returns Draft 정보
 * @throws Error - Draft 없음 (404) 또는 권한 없음 (403)
 */
export async function getDraft(noteId: string): Promise<NoteDraftResponse> {
  const response = await apiClient.get<ApiResponse<NoteDraftResponse>>(`${API_BASE_URL}/${noteId}`);
  return response.data.data;
}

/**
 * Draft 목록 조회 (GET /api/drafts)
 *
 * @returns 사용자의 모든 Draft 목록 (lastModified 내림차순)
 * @throws Error - 조회 실패 시
 */
export async function listDrafts(): Promise<NoteDraftListResponse> {
  const response = await apiClient.get<ApiResponse<NoteDraftListResponse>>(API_BASE_URL);
  return response.data.data;
}

/**
 * Draft 삭제 (DELETE /api/drafts/{noteId})
 *
 * @param noteId - Draft UUID
 * @throws Error - Draft 없음 (404) 또는 권한 없음 (403)
 */
export async function deleteDraft(noteId: string): Promise<void> {
  await apiClient.delete(`${API_BASE_URL}/${noteId}`);
}

/**
 * Draft → DB 저장 (POST /api/notes/from-draft/{noteId})
 *
 * 동작:
 * 1. Draft 조회 (Redis)
 * 2. 검증 (title AND content 필수)
 * 3. DB 저장 (PostgreSQL)
 * 4. Draft 삭제 (Redis)
 *
 * @param noteId - Draft UUID
 * @returns 생성된 Note ID
 * @throws Error - 검증 실패 또는 저장 실패
 */
export async function saveToDatabase(noteId: string): Promise<number> {
  const response = await apiClient.post<ApiResponse<{ id: number }>>(
    `/api/notes/from-draft/${noteId}`,
  );
  return response.data.data.id;
}
