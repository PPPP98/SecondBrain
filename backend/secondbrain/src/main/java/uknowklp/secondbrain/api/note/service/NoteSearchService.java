package uknowklp.secondbrain.api.note.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.MultiMatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.TermQuery;
import lombok.RequiredArgsConstructor;
import uknowklp.secondbrain.api.note.domain.NoteDocument;
import uknowklp.secondbrain.api.note.repository.NoteSearchRepository;

@Service
@RequiredArgsConstructor
public class NoteSearchService {

	private final NoteSearchRepository noteSearchRepository;
	private final ElasticsearchOperations elasticsearchOperations;

	// 키워드로 노트 검색 (제목 + 내용, 유사도 기반)
	public Page<NoteDocument> searchByKeyword(String keyword, Long memberId, Pageable pageable) {
		// 1. Multi-match 쿼리 생성 (제목에 2배 가중치)
		Query multiMatchQuery = MultiMatchQuery.of(m -> m
			.query(keyword)
			.fields("title^2", "content")
			.type(co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType.BestFields)
		)._toQuery();

		// 2. Bool 쿼리 생성
		BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder()
			.must(multiMatchQuery);

		// 3. memberId 필터 추가 (특정 사용자의 노트만 검색)
		if (memberId != null) {
			Query memberFilter = TermQuery.of(t -> t
				.field("memberId")
				.value(memberId)
			)._toQuery();
			boolQueryBuilder.filter(memberFilter);
		}

		// 4. Native Query 생성
		NativeQuery searchQuery = NativeQuery.builder()
			.withQuery(boolQueryBuilder.build()._toQuery())
			.withPageable(pageable)
			.build();

		// 5. 검색 실행
		SearchHits<NoteDocument> searchHits = elasticsearchOperations.search(
			searchQuery,
			NoteDocument.class
		);

		// 6. 결과 변환
		List<NoteDocument> content = searchHits.getSearchHits().stream()
			.map(SearchHit::getContent)
			.collect(Collectors.toList());

		return new PageImpl<>(content, pageable, searchHits.getTotalHits());
	}

	// 특정 노트와 유사한 노트 찾기 (연관 높은 노트 추천)
	public List<NoteDocument> findSimilarNotes(Long noteId, Long memberId, int limit) {
		// 기준 노트 조회
		NoteDocument baseNote = noteSearchRepository.findById(noteId.toString())
			.orElse(null);

		if (baseNote == null) {
			return List.of();
		}

		// 기준 노트의 제목과 내용으로 유사 노트 검색
		String searchText = baseNote.getTitle() + " " + baseNote.getContent();

		Query multiMatchQuery = MultiMatchQuery.of(m -> m
			.query(searchText)
			.fields("title^2", "content")
			.type(co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType.BestFields)
		)._toQuery();

		// Bool 쿼리 생성 (자기 자신 제외 + memberId 필터)
		BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder()
			.must(multiMatchQuery)
			.mustNot(TermQuery.of(t -> t
				.field("id")
				.value(noteId)
			)._toQuery());

		// memberId 필터 추가
		if (memberId != null) {
			boolQueryBuilder.filter(TermQuery.of(t -> t
				.field("memberId")
				.value(memberId)
			)._toQuery());
		}

		// Native Query 생성
		NativeQuery searchQuery = NativeQuery.builder()
			.withQuery(boolQueryBuilder.build()._toQuery())
			.withMaxResults(limit)
			.build();

		// 검색 실행
		SearchHits<NoteDocument> searchHits = elasticsearchOperations.search(
			searchQuery,
			NoteDocument.class
		);

		// 결과 반환
		return searchHits.getSearchHits().stream()
			.map(SearchHit::getContent)
			.collect(Collectors.toList());
	}

	// 노트 인덱싱 (PostgreSQL에서 Note 저장 시 호출)
	public void indexNote(NoteDocument noteDocument) {
		noteSearchRepository.save(noteDocument);
	}

	// 노트 삭제 (PostgreSQL에서 Note 삭제 시 호출)
	public void deleteNote(Long noteId) {
		noteSearchRepository.deleteById(noteId.toString());
	}
}
