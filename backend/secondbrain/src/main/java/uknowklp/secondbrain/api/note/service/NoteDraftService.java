package uknowklp.secondbrain.api.note.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import uknowklp.secondbrain.api.note.domain.NoteDraft;
import uknowklp.secondbrain.api.note.dto.NoteDraftRequest;
import uknowklp.secondbrain.api.note.dto.NoteDraftResponse;
import uknowklp.secondbrain.global.exception.BaseException;
import uknowklp.secondbrain.global.response.BaseResponseStatus;

/**
 * NoteDraft Redis 관리 서비스
 *
 * Write-Behind 패턴:
 * 1. 프론트엔드 Debouncing (500ms)
 * 2. Redis 임시 저장 (TTL 24h)
 * 3. 자동 저장 트리거 (50회 변경 or 5분 경과 or 페이지 이탈 or Side Peek 닫기)
 * 4. DB 영구 저장
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NoteDraftService {

	private final RedisTemplate<String, Object> redisTemplate;
	private final ObjectMapper objectMapper;

	// Redis Key Pattern
	private static final String DRAFT_PREFIX = "draft:note:";

	// TTL: 24시간
	private static final Duration DRAFT_TTL = Duration.ofHours(24);

	/**
	 * Draft 저장 (Redis)
	 *
	 * 검증 전략: title 또는 content 중 하나라도 있으면 저장
	 *
	 * @param userId  사용자 ID
	 * @param request Draft 요청
	 * @return 저장된 noteId (새 노트의 경우 UUID 생성)
	 */
	public String saveDraft(Long userId, NoteDraftRequest request) {
		try {
			// 최소 검증: title 또는 content 중 하나라도 있어야 함
			if (!request.isValid()) {
				log.warn("Draft 저장 실패 - 빈 내용 - UserId: {}", userId);
				throw new BaseException(BaseResponseStatus.DRAFT_EMPTY);
			}

			// noteId가 없으면 새 UUID 생성 (새 노트)
			String noteId = request.getNoteId() != null
				? request.getNoteId()
				: UUID.randomUUID().toString();

			// 기존 draft 조회 (충돌 감지)
			NoteDraft existingDraft = getDraftOrNull(noteId);

			// Version 충돌 검사 (Optimistic Locking)
			if (existingDraft != null && request.getVersion() != null) {
				if (!existingDraft.getVersion().equals(request.getVersion())) {
					log.warn("Version conflict - NoteId: {}, Expected: {}, Actual: {}",
						noteId, request.getVersion(), existingDraft.getVersion());
					throw new BaseException(BaseResponseStatus.DRAFT_VERSION_CONFLICT);
				}
			}

			// NoteDraft 생성 또는 업데이트
			NoteDraft draft = existingDraft != null
				? updateExistingDraft(existingDraft, request)
				: createNewDraft(noteId, userId, request);

			// Redis 저장
			String key = DRAFT_PREFIX + noteId;
			redisTemplate.opsForValue().set(key, draft, DRAFT_TTL);

			log.info("Draft 저장 완료 - NoteId: {}, UserId: {}, Version: {}",
				noteId, userId, draft.getVersion());

			return noteId;

		} catch (BaseException e) {
			throw e;
		} catch (Exception e) {
			log.error("Draft 저장 실패 - UserId: {}", userId, e);
			throw new BaseException(BaseResponseStatus.REDIS_ERROR);
		}
	}

	/**
	 * Draft 조회 (Redis)
	 *
	 * @param noteId 노트 ID
	 * @param userId 사용자 ID
	 * @return NoteDraft
	 */
	public NoteDraft getDraft(String noteId, Long userId) {
		NoteDraft draft = getDraftOrNull(noteId);

		if (draft == null) {
			log.warn("Draft 없음 - NoteId: {}, UserId: {}", noteId, userId);
			throw new BaseException(BaseResponseStatus.DRAFT_NOT_FOUND);
		}

		// 소유권 검증
		if (!draft.getUserId().equals(userId)) {
			log.warn("Draft 접근 권한 없음 - NoteId: {}, UserId: {}", noteId, userId);
			throw new BaseException(BaseResponseStatus.DRAFT_ACCESS_DENIED);
		}

		return draft;
	}

	/**
	 * 사용자의 모든 Draft 목록 조회 (Redis)
	 *
	 * 사용 시나리오:
	 * - 브라우저 재시작 후 미저장 Draft 복구
	 * - 여러 노트를 동시에 작성 중인 경우
	 *
	 * @param userId 사용자 ID
	 * @return Draft 목록 (lastModified 기준 내림차순)
	 */
	public List<NoteDraftResponse> listUserDrafts(Long userId) {
		try {
			Set<String> keys = redisTemplate.keys(DRAFT_PREFIX + "*");

			if (keys == null || keys.isEmpty()) {
				log.debug("Draft 목록 없음 - UserId: {}", userId);
				return Collections.emptyList();
			}

			List<NoteDraftResponse> drafts = keys.stream()
				.map(this::getDraftOrNull)
				.filter(Objects::nonNull)
				.filter(draft -> draft.getUserId().equals(userId))
				.sorted(Comparator.comparing(NoteDraft::getLastModified).reversed())
				.map(NoteDraftResponse::from)
				.collect(Collectors.toList());

			log.info("Draft 목록 조회 완료 - UserId: {}, Count: {}", userId, drafts.size());
			return drafts;

		} catch (Exception e) {
			log.error("Draft 목록 조회 실패 - UserId: {}", userId, e);
			return Collections.emptyList();
		}
	}

	/**
	 * Draft 삭제 (Redis)
	 *
	 * @param noteId 노트 ID
	 * @param userId 사용자 ID
	 */
	public void deleteDraft(String noteId, Long userId) {
		try {
			// 소유권 검증
			NoteDraft draft = getDraft(noteId, userId);

			String key = DRAFT_PREFIX + noteId;
			Boolean deleted = redisTemplate.delete(key);

			log.info("Draft 삭제 완료 - NoteId: {}, UserId: {}, Deleted: {}",
				noteId, userId, deleted);

		} catch (Exception e) {
			log.error("Draft 삭제 실패 - NoteId: {}, UserId: {}", noteId, userId, e);
			// Best-effort 삭제 (실패해도 TTL로 자동 삭제됨)
		}
	}

	/**
	 * Draft 존재 여부 확인
	 *
	 * @param noteId 노트 ID
	 * @return 존재 여부
	 */
	public boolean existsDraft(String noteId) {
		String key = DRAFT_PREFIX + noteId;
		return Boolean.TRUE.equals(redisTemplate.hasKey(key));
	}

	/**
	 * 오래된 Draft 조회 (자동 저장용)
	 *
	 * Batching 전략: 5분마다 백엔드 스케줄러가 호출
	 *
	 * @param minutes lastModified가 이 시간보다 오래된 Draft
	 * @return 오래된 Draft 목록
	 */
	public List<NoteDraft> getStaleDrafts(int minutes) {
		try {
			Set<String> keys = redisTemplate.keys(DRAFT_PREFIX + "*");

			if (keys == null || keys.isEmpty()) {
				return Collections.emptyList();
			}

			LocalDateTime threshold = LocalDateTime.now().minusMinutes(minutes);

			List<NoteDraft> staleDrafts = keys.stream()
				.map(this::getDraftOrNull)
				.filter(Objects::nonNull)
				.filter(draft -> draft.getLastModified().isBefore(threshold))
				.collect(Collectors.toList());

			log.debug("오래된 Draft 조회 - Threshold: {}분, Count: {}", minutes, staleDrafts.size());
			return staleDrafts;

		} catch (Exception e) {
			log.error("오래된 Draft 조회 실패", e);
			return Collections.emptyList();
		}
	}

	// ===== Private Helper Methods =====

	/**
	 * Draft 조회 (소유권 검증 없음)
	 *
	 * @param key Redis key 또는 noteId
	 * @return NoteDraft 또는 null
	 */
	private NoteDraft getDraftOrNull(String key) {
		try {
			if (!key.startsWith(DRAFT_PREFIX)) {
				key = DRAFT_PREFIX + key;
			}

			Object value = redisTemplate.opsForValue().get(key);

			if (value == null) {
				return null;
			}

			// GenericJackson2JsonRedisSerializer가 자동으로 NoteDraft로 역직렬화
			return objectMapper.convertValue(value, NoteDraft.class);

		} catch (Exception e) {
			log.error("Draft 조회 실패 - Key: {}", key, e);
			return null;
		}
	}

	/**
	 * 새 Draft 생성
	 */
	private NoteDraft createNewDraft(String noteId, Long userId, NoteDraftRequest request) {
		return NoteDraft.builder()
			.noteId(noteId)
			.userId(userId)
			.title(request.getTitle())
			.content(request.getContent())
			.version(1L)
			.lastModified(LocalDateTime.now())
			.deltas(null) // 미래 확장용
			.build();
	}

	/**
	 * 기존 Draft 업데이트
	 */
	private NoteDraft updateExistingDraft(NoteDraft existing, NoteDraftRequest request) {
		existing.updateContent(request.getTitle(), request.getContent());
		return existing;
	}
}
