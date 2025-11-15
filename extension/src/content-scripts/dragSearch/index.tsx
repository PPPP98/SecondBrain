import ReactDOM from 'react-dom/client';
import browser from 'webextension-polyfill';
import { DragSearchListener } from './DragSearchListener';
import { FloatingSearchButton } from './FloatingSearchButton';
import type {
  DragSearchMessage,
  DragSearchResponse,
  DragSearchSettings,
  FloatingButtonPosition,
} from '@/types/dragSearch';

// 기본 설정
const DEFAULT_SETTINGS: DragSearchSettings = {
  enabled: true,
  minTextLength: 2,
  debounceMs: 300,
  autoHideMs: 3000,
  excludedDomains: [],
};

/**
 * 드래그 검색 매니저
 * Content Script에서 드래그 검색 기능 총괄 관리
 */
class DragSearchManager {
  private listener: DragSearchListener | null = null;
  private floatingButtonRoot: ReactDOM.Root | null = null;
  private floatingButtonContainer: HTMLDivElement | null = null;
  private currentKeyword = '';
  private settings: DragSearchSettings = DEFAULT_SETTINGS;

  /**
   * 초기화
   */
  async initialize(): Promise<void> {
    // 설정 로드
    const stored = await browser.storage.local.get(['dragSearchSettings']);
    if (stored.dragSearchSettings) {
      this.settings = { ...DEFAULT_SETTINGS, ...stored.dragSearchSettings };
    }

    // 리스너 초기화
    this.listener = new DragSearchListener(this.settings, this.handleDragSearch);

    // Background로부터 응답 수신
    browser.runtime.onMessage.addListener(this.handleBackgroundMessage);

    // Storage 변경 감지 (설정 업데이트)
    browser.storage.onChanged.addListener(this.handleStorageChange);
  }

  /**
   * 드래그 감지 콜백
   */
  private handleDragSearch = (keyword: string, position: FloatingButtonPosition): void => {
    this.currentKeyword = keyword;
    this.showFloatingButton(position);
  };

  /**
   * 플로팅 버튼 표시 (Shadow DOM 사용)
   */
  private showFloatingButton(position: FloatingButtonPosition): void {
    // 기존 버튼 제거
    this.hideFloatingButton();

    // Shadow Host 생성
    this.floatingButtonContainer = document.createElement('div');
    this.floatingButtonContainer.id = 'secondbrain-drag-search-button';
    this.floatingButtonContainer.style.cssText =
      'all: initial; position: fixed; z-index: 2147483647;';
    document.body.appendChild(this.floatingButtonContainer);

    // Shadow DOM 생성
    const shadowRoot = this.floatingButtonContainer.attachShadow({ mode: 'open' });

    // Tailwind CSS 주입
    const style = document.createElement('style');
    style.textContent = this.getTailwindStyles();
    shadowRoot.appendChild(style);

    // React 컨테이너 생성
    const reactContainer = document.createElement('div');
    shadowRoot.appendChild(reactContainer);

    // React 렌더링
    this.floatingButtonRoot = ReactDOM.createRoot(reactContainer);
    this.floatingButtonRoot.render(
      <FloatingSearchButton
        position={position}
        keyword={this.currentKeyword}
        onSearch={this.handleSearchClick}
        onClose={this.hideFloatingButton}
        autoHideMs={this.settings.autoHideMs}
      />,
    );
  }

  /**
   * FloatingSearchButton용 Tailwind 스타일
   */
  private getTailwindStyles(): string {
    return `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      }

      .fixed { position: fixed; }
      .flex { display: flex; }
      .items-center { align-items: center; }
      .gap-2 { gap: 0.5rem; }
      .rounded-lg { border-radius: 0.5rem; }
      .bg-white { background-color: white; }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      .hover\\:shadow-xl:hover { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
      .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
      .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
      .font-medium { font-weight: 500; }
      .text-gray-700 { color: rgb(55, 65, 81); }
      .text-gray-400 { color: rgb(156, 163, 175); }
      .hover\\:text-blue-600:hover { color: rgb(37, 99, 235); }
      .hover\\:text-gray-600:hover { color: rgb(75, 85, 99); }
      .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
      .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
      .duration-200 { transition-duration: 200ms; }
      .max-w-\\[200px\\] { max-width: 200px; }
      .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .flex-shrink-0 { flex-shrink: 0; }
      .cursor-pointer { cursor: pointer; }

      button {
        all: unset;
        cursor: pointer;
        display: flex;
        align-items: center;
      }

      .floating-button {
        position: fixed;
        z-index: 999999;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem;
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.05);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .floating-button:hover {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      .search-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: rgb(55, 65, 81);
        transition: color 150ms;
      }

      .search-button:hover {
        color: rgb(37, 99, 235);
      }

      .close-button {
        padding: 0.5rem;
        color: rgb(156, 163, 175);
        transition: color 150ms;
      }

      .close-button:hover {
        color: rgb(75, 85, 99);
      }

      .keyword-text {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }
    `;
  }

  /**
   * 검색 버튼 클릭 핸들러
   */
  private handleSearchClick = (): void => {
    // Background로 검색 요청
    const message: DragSearchMessage = {
      type: 'SEARCH_DRAG_TEXT',
      keyword: this.currentKeyword,
      timestamp: Date.now(),
    };

    browser.runtime.sendMessage(message).catch((error) => {
      console.error('[SecondBrain] 드래그 검색 메시지 전송 실패:', error);
    });

    this.hideFloatingButton();
  };

  /**
   * 플로팅 버튼 숨기기
   */
  private hideFloatingButton = (): void => {
    if (this.floatingButtonRoot) {
      this.floatingButtonRoot.unmount();
      this.floatingButtonRoot = null;
    }
    if (this.floatingButtonContainer) {
      this.floatingButtonContainer.remove();
      this.floatingButtonContainer = null;
    }
  };

  /**
   * Background로부터 검색 결과 수신
   */
  private handleBackgroundMessage = (message: unknown): void | boolean => {
    const response = message as DragSearchResponse;

    if (response.type === 'DRAG_SEARCH_RESULT') {
      // Overlay UI 열기 + 검색 결과 표시
      this.openOverlayWithResults(
        response.keyword,
        response.results || [],
        response.totalCount || 0,
      );
      return; // 명시적 undefined 반환 (비동기 응답 불필요)
    } else if (response.type === 'DRAG_SEARCH_ERROR') {
      // 에러 표시
      console.error('[SecondBrain] 드래그 검색 에러:', response.error);

      // 에러 메시지를 Overlay로 전달
      window.postMessage(
        {
          type: 'SECONDBRAIN_DRAG_SEARCH_ERROR',
          payload: {
            keyword: response.keyword,
            error: response.error,
          },
        },
        '*',
      );
      return; // 명시적 undefined 반환 (비동기 응답 불필요)
    }

    // 이 리스너가 처리하지 않는 메시지는 무시
    return; // 명시적 undefined 반환
  };

  /**
   * Overlay UI를 열고 검색 결과 전달
   */
  private openOverlayWithResults(keyword: string, results: unknown[], totalCount: number): void {
    // Overlay UI에 검색 결과 전달
    window.postMessage(
      {
        type: 'SECONDBRAIN_DRAG_SEARCH_RESULT',
        payload: {
          keyword,
          results,
          totalCount,
        },
      },
      '*',
    );
  }

  /**
   * Storage 변경 감지 (설정 업데이트)
   */
  private handleStorageChange = (
    changes: Record<string, browser.Storage.StorageChange>,
    areaName: string,
  ): void => {
    if (areaName === 'local' && changes.dragSearchSettings) {
      const newSettings = changes.dragSearchSettings.newValue as DragSearchSettings | undefined;
      if (newSettings) {
        this.settings = { ...DEFAULT_SETTINGS, ...newSettings };
        this.listener?.updateSettings(this.settings);
      }
    }
  };

  /**
   * Cleanup
   */
  destroy(): void {
    this.listener?.destroy();
    this.hideFloatingButton();
    browser.runtime.onMessage.removeListener(this.handleBackgroundMessage);
    browser.storage.onChanged.removeListener(this.handleStorageChange);
  }
}

// 초기화 실행
const manager = new DragSearchManager();
manager.initialize().catch((error) => {
  console.error('[SecondBrain] 드래그 검색 초기화 실패:', error);
});

// Hot Module Replacement 지원 (개발 환경)
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    manager.destroy();
  });
}
