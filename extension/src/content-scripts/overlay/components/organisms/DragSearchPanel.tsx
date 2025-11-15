import React from 'react';
import { Search, ExternalLink, Calendar, Loader2, History, Trash2 } from 'lucide-react';
import type { NoteSearchResult } from '@/types/note';
import { useDragSearchStore } from '@/stores/dragSearchStore';
import browser from 'webextension-polyfill';

interface DragSearchPanelProps {
  keyword: string;
  results: NoteSearchResult[];
  totalCount: number;
  isLoading: boolean;
  error?: string | null;
}

/**
 * 드래그 검색 결과 패널
 * Overlay UI 내부에 표시되는 검색 결과 목록
 */
export const DragSearchPanel: React.FC<DragSearchPanelProps> = ({
  keyword,
  results,
  totalCount,
  isLoading,
  error,
}) => {
  const { searchHistory, clearHistory, setLoading } = useDragSearchStore();

  // 히스토리 아이템 클릭 시 재검색
  const handleHistoryClick = (historyKeyword: string) => {
    setLoading(true);

    // Background로 검색 요청
    browser.runtime
      .sendMessage({
        type: 'SEARCH_DRAG_TEXT',
        keyword: historyKeyword,
        timestamp: Date.now(),
      })
      .catch((err) => {
        console.error('[DragSearchPanel] Failed to search from history:', err);
      });
  };
  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">검색 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 rounded-full bg-red-50 p-3">
          <Search className="h-8 w-8 text-red-500" />
        </div>
        <p className="font-medium text-gray-800">검색 중 오류가 발생했습니다</p>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  // 결과 없음 (히스토리 표시)
  if (results.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {/* 검색 결과 없음 메시지 */}
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-3 rounded-full bg-gray-50 p-3">
            <Search className="h-12 w-12 text-gray-300" />
          </div>
          <p className="font-medium text-gray-600">
            &quot;{keyword}&quot;와 관련된 노트가 없습니다
          </p>
          <p className="mt-1 text-sm text-gray-400">다른 키워드로 검색해보세요</p>
        </div>

        {/* 검색 히스토리 */}
        {searchHistory.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <History className="h-4 w-4" />
                최근 검색
              </h4>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-red-600"
                title="히스토리 삭제"
              >
                <Trash2 className="h-3 w-3" />
                전체 삭제
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {searchHistory.map((item, index) => (
                <button
                  key={`${item.keyword}-${index}`}
                  onClick={() => handleHistoryClick(item.keyword)}
                  className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-left text-sm transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="truncate text-gray-700">{item.keyword}</span>
                  <span className="ml-2 flex-shrink-0 text-xs text-gray-400">
                    {item.resultCount}개 결과
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 검색 결과 표시
  return (
    <div className="flex flex-col gap-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Search className="h-5 w-5 text-blue-600" />
          <span>&quot;{keyword}&quot; 검색 결과</span>
        </h3>
        <span className="text-sm font-medium text-gray-500">{totalCount}개 노트</span>
      </div>

      {/* 결과 리스트 */}
      <div className="flex max-h-[500px] flex-col gap-3 overflow-y-auto pr-2">
        {results.map((note) => (
          <div
            key={note.id}
            className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
            onClick={() => {
              // 노트 상세 페이지로 이동 (새 탭)
              window.open(`https://api.brainsecond.site/notes/${note.id}`, '_blank');
            }}
          >
            {/* 제목 */}
            <h4 className="flex items-center gap-2 font-medium text-gray-800 transition-colors group-hover:text-blue-600">
              {note.title}
              <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </h4>

            {/* 내용 미리보기 */}
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
              {note.content}
            </p>

            {/* 메타 정보 */}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(note.updatedAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              {note.remindCount > 0 && (
                <span className="rounded bg-blue-100 px-2 py-0.5 font-medium text-blue-600">
                  복습 {note.remindCount}회
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 더 많은 결과 표시 */}
      {totalCount > results.length && (
        <div className="border-t border-gray-200 pt-3 text-center">
          <p className="text-sm text-gray-500">
            {results.length}개 결과 표시 중 (전체 {totalCount}개)
          </p>
        </div>
      )}
    </div>
  );
};
