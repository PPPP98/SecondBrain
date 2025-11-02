package uknowklp.secondbrain.api.note.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import uknowklp.secondbrain.api.note.domain.NoteDocument;
import uknowklp.secondbrain.api.note.dto.NoteSearchResponse;
import uknowklp.secondbrain.api.note.dto.NoteSearchResult;
import uknowklp.secondbrain.api.note.service.NoteSearchService;
import uknowklp.secondbrain.global.response.BaseResponse;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteSearchController {

	private final NoteSearchService noteSearchService;

	// GET /api/notes/search?keyword=검색어&page=0&size=10
	@GetMapping("/search")
	public BaseResponse<NoteSearchResponse> searchNotes(
		@RequestParam String keyword,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(required = false) Long memberId // TODO: 인증 구현 후 @AuthenticationPrincipal로 변경
	) {
		Pageable pageable = PageRequest.of(page, size);
		Page<NoteDocument> searchResults = noteSearchService.searchByKeyword(keyword, memberId, pageable);

		// NoteDocument -> NoteSearchResult 변환
		List<NoteSearchResult> results = searchResults.getContent().stream()
			.map(NoteSearchResult::from)
			.collect(Collectors.toList());

		NoteSearchResponse response = NoteSearchResponse.builder()
			.results(results)
			.totalCount(searchResults.getTotalElements())
			.currentPage(searchResults.getNumber())
			.totalPages(searchResults.getTotalPages())
			.pageSize(searchResults.getSize())
			.build();

		return new BaseResponse<>(response);
	}

	// GET /api/notes/{noteId}/similar?limit=5
	@GetMapping("/{noteId}/similar")
	public BaseResponse<List<NoteSearchResult>> findSimilarNotes(
		@PathVariable Long noteId,
		@RequestParam(defaultValue = "5") int limit,
		@RequestParam(required = false) Long memberId // TODO: 인증 구현 후 @AuthenticationPrincipal로 변경
	) {
		List<NoteDocument> similarNotes = noteSearchService.findSimilarNotes(noteId, memberId, limit);

		List<NoteSearchResult> results = similarNotes.stream()
			.map(NoteSearchResult::from)
			.collect(Collectors.toList());

		return new BaseResponse<>(results);
	}

	// POST /api/notes/index (테스트용 - 임시 인덱싱 API)
	@PostMapping("/index")
	public BaseResponse<String> indexNote(@RequestBody NoteDocument noteDocument) {
		noteSearchService.indexNote(noteDocument);
		String message = "노트가 인덱싱되었습니다: " + noteDocument.getId();
		return new BaseResponse<>(message);
	}

	// POST /api/notes/test-data (테스트용 - 샘플 데이터 생성)
	@PostMapping("/test-data")
	public BaseResponse<String> createTestData() {
		noteSearchService.createTestData();
		return new BaseResponse<>("테스트 데이터가 생성되었습니다");
	}
}
