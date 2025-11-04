package uknowklp.secondbrain.api.note.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import uknowklp.secondbrain.api.note.domain.Note;

public interface NoteRepository extends JpaRepository<Note, Long> {

	/**
	 * 사용자의 최근 노트 목록 조회 (상위 10개)
	 * updatedAt 기준 내림차순 정렬, 동일 시 noteId 기준 내림차순
	 *
	 * @param userId 사용자 ID
	 * @return 최근 노트 목록 (최대 10개)
	 */
	@Query("SELECT n FROM Note n WHERE n.user.id = :userId ORDER BY n.updatedAt DESC, n.id DESC LIMIT 10")
	List<Note> findTop10ByUserIdOrderByUpdatedAtDesc(@Param("userId") Long userId);
}
