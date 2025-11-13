import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
import { OverlayRoot } from '@/content-scripts/overlay/OverlayRoot';
import overlayStyles from '@/content-scripts/overlay.css?inline';

/**
 * Content Script 엔트리포인트
 * - Shadow DOM 생성 및 스타일 격리
 * - React 앱 마운트
 * - Tailwind CSS + Shadcn UI styles inline 주입
 * - Background와 메시지 통신
 */

export async function onExecute() {
  console.log('🚀 [Content Script] onExecute called - starting initialization...');

  // Overlay 토글 상태 관리
  let isOverlayVisible = false;

  try {
    console.log('🔧 [Content Script] Creating Shadow DOM...');

    // Shadow DOM 컨테이너 생성
    const container = document.createElement('div');
    container.id = 'secondbrain-extension-container';

    // Shadow DOM 생성 (스타일 격리)
    const shadowRoot = container.attachShadow({ mode: 'open' });
    console.log('✅ [Content Script] Shadow DOM created');

    // Tailwind CSS를 Shadow DOM에 주입 (inline import)
    const style = document.createElement('style');
    style.textContent = overlayStyles;
    shadowRoot.appendChild(style);
    console.log('✅ [Content Script] Tailwind CSS injected into Shadow DOM (' + overlayStyles.length + ' chars)');

    // React 앱 마운트 포인트 (ThemeContext에서 찾을 수 있도록 id 설정)
    const appRoot = document.createElement('div');
    appRoot.id = 'secondbrain-extension-root';
    shadowRoot.appendChild(appRoot);

    // 컨테이너를 body에 추가
    document.body.appendChild(container);
    console.log('✅ [Content Script] Shadow DOM attached to body');

    // React 앱 렌더링
    const root = createRoot(appRoot);
    console.log('✅ [Content Script] React root created');

    // 초기 상태로 렌더링
    function renderOverlay(visible: boolean): void {
      isOverlayVisible = visible;
      root.render(<OverlayRoot isOpen={visible} onToggle={setOverlayVisible} shadowRoot={shadowRoot} />);
      console.log(`🎨 [Content Script] Overlay rendered: ${visible ? 'visible' : 'hidden'}`);
    }

    function setOverlayVisible(visible: boolean): void {
      renderOverlay(visible);
    }

    // 초기 렌더링 (닫힌 상태)
    renderOverlay(false);
    console.log('✅ [Content Script] Initial render complete');

    // Background로부터 메시지 수신 (Content Script 레벨)
    browser.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
      const msg = message as { type: string };

      if (msg.type === 'TOGGLE_OVERLAY') {
        console.log('📨 [Content Script] TOGGLE_OVERLAY received');
        renderOverlay(!isOverlayVisible);
        sendResponse({ success: true });
      } else if (msg.type === 'PING') {
        // Content Script가 활성화되어 있음을 알리는 응답
        console.log('📨 [Content Script] PING received');
        sendResponse({ pong: true });
      }

      return true; // 비동기 응답을 위해 true 반환
    });

    console.log('✅ SecondBrain Extension Overlay loaded');
  } catch (error) {
    console.error('❌ [Content Script] Fatal error:', error);
    console.error('Stack trace:', (error as Error).stack);
  }
}
