import { useEffect } from 'react';
import { useSearchPanelStore } from '@/features/main/stores/searchPanelStore';
import { PanelHeader } from '@/features/main/components/PanelHeader';
import { NoteList } from '@/features/main/components/NoteList';
import { useRecentNotes } from '@/features/main/hooks/useRecentNotes';
import { useSearchNotes } from '@/features/main/hooks/useSearchNotes';
import { GlassContainer } from '@/shared/components/GlassContainer/GlassContainer';
import type { RecentNote } from '@/features/main/types/search';

export function SearchPanel() {
  const mode = useSearchPanelStore((state) => state.mode);
  const query = useSearchPanelStore((state) => state.query);
  const setHighlightedNodes = useSearchPanelStore((state) => state.setHighlightedNodes);
  const clearHighlightedNodes = useSearchPanelStore((state) => state.clearHighlightedNodes);

  // 실제 데이터 조회
  const recentNotesQuery = useRecentNotes();
  const searchNotesQuery = useSearchNotes({ keyword: query });

  // 현재 모드에 따라 전체 노트 ID 추출
  const getAllNoteIds = (): number[] => {
    if (mode === 'recent' && recentNotesQuery.data) {
      const notes = recentNotesQuery.data;
      if (Array.isArray(notes)) {
        return notes.map((note: RecentNote) => note.noteId);
      }
      return [];
    }

    if (mode === 'search' && searchNotesQuery.data?.pages) {
      const allNotes = searchNotesQuery.data.pages.flatMap((page) => {
        return page.results || [];
      });
      return allNotes.map((note) => note.id);
    }

    return [];
  };

  const allNoteIds = getAllNoteIds();

  // 검색 모드일 때 검색 결과 노드를 그래프에서 강조
  useEffect(() => {
    if (mode === 'search' && allNoteIds.length > 0) {
      setHighlightedNodes(allNoteIds);
    } else {
      clearHighlightedNodes();
    }
  }, [
    mode,
    searchNotesQuery.data,
    recentNotesQuery.data,
    setHighlightedNodes,
    clearHighlightedNodes,
  ]);

  return (
    <GlassContainer>
      <PanelHeader />
      {/* Divider between header and list */}
      <div className="border-b border-white/75" />
      <div
        data-scroll-container="true"
        className="m-0 flex flex-1 flex-col overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {mode === 'recent' && <NoteList type="recent" recentQuery={recentNotesQuery} />}
        {mode === 'search' && <NoteList type="search" searchQuery={searchNotesQuery} />}
      </div>
    </GlassContainer>
  );
}
