package uknowklp.secondbrain.api.note.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Draft 저장 요청 DTO
 *
 * 검증 전략: 유연한 검증 (타이핑 중 빈 값 허용)
 * - Redis 저장: title 또는 content 중 하나라도 있으면 허용
 * - DB 저장: 둘 다 필수 (NoteService.validateNoteRequest()에서 검증)
 */
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NoteDraftRequest {

	/**
	 * 노트 ID (기존 노트) 또는 null (새 노트)
	 * null인 경우 서버에서 UUID 생성
	 */
	private String noteId;

	/**
	 * 제목 (타이핑 중 빈 값 허용, Redis에만 저장)
	 * DB 저장 시 NoteService에서 @NotBlank 검증
	 */
	@Size(max = 64, message = "제목은 64자를 초과할 수 없습니다")
	private String title;

	/**
	 * 내용 (타이핑 중 빈 값 허용, Redis에만 저장)
	 * DB 저장 시 NoteService에서 @NotBlank 검증
	 * TEXT 타입으로 길이 제한 없음
	 */
	private String content;

	/**
	 * 버전 (충돌 감지용, 선택적)
	 * 프론트엔드에서 보내지 않으면 null
	 */
	private Long version;

	/**
	 * Draft 유효성 검사 (최소 요구사항)
	 *
	 * title 또는 content 중 하나라도 있어야 함
	 * 둘 다 비어있으면 Redis에 저장할 필요 없음
	 *
	 * @return 유효 여부
	 */
	public boolean isValid() {
		return (title != null && !title.trim().isEmpty()) ||
			(content != null && !content.trim().isEmpty());
	}
}
