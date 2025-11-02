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

	// 테스트 데이터 생성 (개발용)
	public void createTestData() {
		List<NoteDocument> testNotes = List.of(
			NoteDocument.builder()
				.id(1L)
				.title("Spring Boot와 Elasticsearch 연동 방법")
				.content("Spring Boot 3.x에서 Elasticsearch를 사용하는 방법을 정리했습니다. Spring Data Elasticsearch를 활용하면 쉽게 연동할 수 있습니다.")
				.memberId(1L)
				.createdAt(java.time.LocalDateTime.now().minusDays(1))
				.updatedAt(java.time.LocalDateTime.now().minusDays(1))
				.remindCount(0)
				.build(),

			NoteDocument.builder()
				.id(2L)
				.title("망각곡선 기반 학습 시스템")
				.content("에빙하우스의 망각곡선 이론을 활용한 효과적인 학습 방법입니다. 반복 학습 간격을 조절하여 장기 기억으로 전환할 수 있습니다.")
				.memberId(1L)
				.createdAt(java.time.LocalDateTime.now().minusDays(2))
				.updatedAt(java.time.LocalDateTime.now().minusDays(2))
				.remindCount(1)
				.build(),

			NoteDocument.builder()
				.id(3L)
				.title("RabbitMQ 메시지 큐 설정")
				.content("RabbitMQ를 사용하여 비동기 메시지 처리를 구현합니다. Exchange와 Queue를 바인딩하여 메시지를 라우팅할 수 있습니다.")
				.memberId(1L)
				.createdAt(java.time.LocalDateTime.now().minusDays(3))
				.updatedAt(java.time.LocalDateTime.now().minusDays(3))
				.remindCount(0)
				.build(),

			NoteDocument.builder()
				.id(4L)
				.title("자바스크립트 비동기 프로그래밍")
				.content("자바스크립트의 Promise와 async/await를 사용한 비동기 처리 방법을 정리했습니다. 콜백 지옥을 피하고 가독성 좋은 코드를 작성할 수 있습니다.")
				.memberId(1L)
				.createdAt(java.time.LocalDateTime.now().minusDays(4))
				.updatedAt(java.time.LocalDateTime.now().minusDays(4))
				.remindCount(2)
				.build(),

			NoteDocument.builder()
				.id(5L)
				.title("Docker 컨테이너 최적화 방법")
				.content("Docker 이미지 크기를 줄이고 빌드 속도를 개선하는 방법입니다. 멀티 스테이지 빌드와 .dockerignore를 활용합니다.")
				.memberId(1L)
				.createdAt(java.time.LocalDateTime.now().minusDays(5))
				.updatedAt(java.time.LocalDateTime.now().minusDays(5))
				.remindCount(0)
				.build(),

			NoteDocument.builder()
				.id(6L)
				.title("JWT 인증 시스템 구현")
				.content("Spring Security와 JWT를 사용한 인증 시스템 구현 방법입니다. Access Token과 Refresh Token을 분리하여 보안을 강화합니다.")
				.memberId(2L)
				.createdAt(java.time.LocalDateTime.now().minusDays(6))
				.updatedAt(java.time.LocalDateTime.now().minusDays(6))
				.remindCount(1)
				.build()
		);

		noteSearchRepository.saveAll(testNotes);
	}
}
