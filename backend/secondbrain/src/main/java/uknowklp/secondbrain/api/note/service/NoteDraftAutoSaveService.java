package uknowklp.secondbrain.api.note.service;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import uknowklp.secondbrain.api.note.domain.Note;
import uknowklp.secondbrain.api.note.domain.NoteDraft;
import uknowklp.secondbrain.api.note.dto.NoteRequest;
import uknowklp.secondbrain.global.exception.BaseException;

/**
 * Draft 자동 저장 스케줄러
 *
 * Batching 전략:
 * - 5분마다 오래된 Draft를 DB로 자동 저장
 * - lastModified가 5분 이상 지난 Draft 대상
 *
 * 자동 저장 트리거 (4가지):
 * 1. 프론트엔드 Batching (50회 변경 or 5분 경과)
 * 2. 페이지 이탈 (beforeunload)
 * 3. Side Peek 닫기
 * 4. 백엔드 스케줄러 (5분마다) ← 이 클래스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NoteDraftAutoSaveService {

	private final NoteDraftService draftService;
	private final NoteService noteService;

	/**
	 * 5분마다 오래된 Draft를 DB로 자동 저장
	 *
	 * 실행 주기: 5분 (300,000ms)
	 * 대상: lastModified가 5분 이상 지난 Draft
	 *
	 * 이중 안전장치:
	 * - 프론트엔드에서 자동 저장 못했을 경우 백업
	 * - 네트워크 끊김이나 브라우저 강제 종료 시 보호
	 */
	@Scheduled(fixedDelay = 300000) // 5분
	@Transactional
	public void autoSaveStaleDrafts() {
		try {
			log.debug("Draft 자동 저장 스케줄러 시작");

			// 5분 이상 지난 Draft 조회
			List<NoteDraft> staleDrafts = draftService.getStaleDrafts(5);

			if (staleDrafts.isEmpty()) {
				log.debug("자동 저장할 Draft 없음");
				return;
			}

			int savedCount = 0;
			int failedCount = 0;

			for (NoteDraft draft : staleDrafts) {
				try {
					// Draft → DB 저장
					promoteDraftToDatabase(draft);
					savedCount++;

				} catch (BaseException e) {
					// 검증 실패 (빈 내용 등) - 정상적인 케이스
					log.warn("Draft 자동 저장 건너뜀 - NoteId: {}, Reason: {}",
						draft.getNoteId(), e.getMessage());
					failedCount++;

				} catch (Exception e) {
					log.error("Draft 자동 저장 실패 - NoteId: {}", draft.getNoteId(), e);
					failedCount++;
				}
			}

			log.info("Draft 자동 저장 완료 - 성공: {}, 실패/건너뜀: {}, 전체: {}",
				savedCount, failedCount, staleDrafts.size());

		} catch (Exception e) {
			log.error("Draft 자동 저장 스케줄러 실패", e);
		}
	}

	/**
	 * Draft를 DB로 승격 저장
	 *
	 * @param draft 저장할 Draft
	 */
	private void promoteDraftToDatabase(NoteDraft draft) {
		// NoteRequest 생성
		NoteRequest request = NoteRequest.of(
			draft.getTitle(),
			draft.getContent(),
			null // images
		);

		// DB 저장 (검증 포함 - title과 content 모두 필수)
		// validateNoteRequest()에서 빈 값 체크
		Note note = noteService.createNote(draft.getUserId(), request);

		// Draft 삭제 (DB 저장 성공 후)
		draftService.deleteDraft(draft.getNoteId(), draft.getUserId());

		log.info("Draft 자동 저장 성공 - DraftId: {} → NoteId: {}",
			draft.getNoteId(), note.getId());
	}
}
