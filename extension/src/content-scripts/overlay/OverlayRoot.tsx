import { ExtensionOverlay } from '@/content-scripts/overlay/components/organisms/ExtensionOverlay';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ShadowRootProvider } from '@/contexts/ShadowRootContext';

/**
 * Shadow DOM 내부에 렌더링되는 React 루트 컴포넌트
 * - ShadowRootProvider로 Shadow Root 컨텍스트 제공
 * - ThemeProvider로 전체 앱을 감싸서 Light/Dark 모드 지원
 * - ExtensionOverlay를 렌더링
 */

interface OverlayRootProps {
  isOpen: boolean;
  onToggle: (visible: boolean) => void;
  shadowRoot: ShadowRoot | HTMLElement;
}

export function OverlayRoot({ isOpen, onToggle, shadowRoot }: OverlayRootProps) {
  return (
    <ShadowRootProvider shadowRoot={shadowRoot}>
      <ThemeProvider>
        <ExtensionOverlay isOpen={isOpen} onToggle={onToggle} />
      </ThemeProvider>
    </ShadowRootProvider>
  );
}
