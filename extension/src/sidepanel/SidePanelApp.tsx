import { useEffect, useState } from 'react';
import { Loader2, FileText } from 'lucide-react';
import MarkdownPreview from '@uiw/react-markdown-preview/nohighlight';
import browser from 'webextension-polyfill';
import type { NoteDetail } from '@/types/noteSearch';
import { getNoteDetail } from '@/services/noteSearchService';

/**
 * Side Panel 메인 앱
 * - Chrome Side Panel에서 노트 전체 내용 표시
 * - @uiw/react-markdown-preview로 GitHub 스타일 마크다운 렌더링
 * - 시스템 다크모드 자동 감지
 */
export function SidePanelApp() {
  const [noteId, setNoteId] = useState<number | null>(null);
  const [note, setNote] = useState<NoteDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');

  // Storage에서 noteId 읽기
  useEffect(() => {
    // 초기 로드
    void browser.storage.local.get(['currentNoteId']).then((result) => {
      if (result.currentNoteId) {
        setNoteId(result.currentNoteId as number);
      }
    });

    // Storage 변경 감지 (다른 노트로 전환 시)
    const handleStorageChange = (
      changes: Record<string, browser.Storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName === 'local') {
        if (changes.currentNoteId) {
          setNoteId(changes.currentNoteId.newValue as number);
        }
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);

    return () => {
      browser.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  // 시스템 다크모드 감지 및 적용
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 초기 설정
    const applyTheme = (isDark: boolean) => {
      const mode = isDark ? 'dark' : 'light';
      setColorMode(mode);
      document.documentElement.setAttribute('data-color-mode', mode);
      document.documentElement.classList.toggle('dark', isDark);
    };

    applyTheme(mediaQuery.matches);

    // 시스템 테마 변경 감지
    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Note 데이터 가져오기
  useEffect(() => {
    if (noteId === null) return;

    async function fetchNote() {
      if (noteId === null) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getNoteDetail(noteId);
        setNote(data);
      } catch (err) {
        console.error('[SidePanelApp] Failed to fetch note:', err);
        setError(err instanceof Error ? err.message : '노트를 불러올 수 없습니다');
      } finally {
        setIsLoading(false);
      }
    }

    void fetchNote();
  }, [noteId]);

  // 로딩 상태
  if (isLoading || !note) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">노트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-white p-6 text-center dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-red-50 p-3 dark:bg-red-950">
            <FileText className="h-12 w-12 text-red-500" />
          </div>
          <div>
            <p className="mb-2 text-base font-medium text-gray-900 dark:text-gray-100">오류 발생</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 노트 표시
  return (
    <div className="flex h-screen flex-col bg-white dark:bg-gray-900">
      {/* Header - 날짜 정보만 표시 */}
      <div className="shrink-0 border-b border-gray-200 bg-gray-50 px-8 py-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          생성: {new Date(note.createdAt).toLocaleDateString('ko-KR')}
          {note.updatedAt && note.updatedAt !== note.createdAt && (
            <> · 수정: {new Date(note.updatedAt).toLocaleDateString('ko-KR')}</>
          )}
        </div>
      </div>

      {/* Content - GitHub 스타일 마크다운 렌더링 */}
      <div className="scrollbar-custom flex-1 overflow-y-auto px-6 py-4">
        <MarkdownPreview
          source={note.content}
          wrapperElement={{
            'data-color-mode': colorMode,
          }}
          style={{
            backgroundColor: 'transparent',
            padding: '0 8px',
          }}
        />
      </div>
    </div>
  );
}
