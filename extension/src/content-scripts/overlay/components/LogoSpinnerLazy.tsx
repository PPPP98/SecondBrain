import { lazy, Suspense } from 'react';
import type { CSSProperties } from 'react';
import type { LogoSpinnerProps } from '@/types/spinner.types';

/**
 * Dynamic Import를 사용한 지연 로딩
 * Three.js 번들(~740KB)을 필요시에만 로드하여 초기 번들 크기 최적화
 */
const LogoSpinner = lazy(() =>
  import('./LogoSpinner').then((module) => ({
    default: module.LogoSpinner,
  })),
);

const LogoSpinnerShadow = lazy(() =>
  import('./LogoSpinnerShadow').then((module) => ({
    default: module.LogoSpinnerShadow,
  })),
);

/**
 * 로딩 중 표시할 간단한 CSS 스피너
 */
function LoadingFallback({ size = 200 }: { size?: number }) {
  const containerStyle: CSSProperties = {
    width: size,
    height: size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const spinnerStyle: CSSProperties = {
    width: size * 0.3,
    height: size * 0.3,
    border: '4px solid #e5e7eb',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * Lazy-loaded 3D Logo Spinner (Tailwind 버전)
 *
 * Three.js 번들을 동적으로 로드하여 초기 로딩 성능을 개선합니다.
 * 초기 번들 크기가 ~740KB 감소합니다.
 *
 * @example
 * ```tsx
 * // 일반 사용
 * <LogoSpinnerLazy size={200} rotationSpeed={0.8} />
 * ```
 *
 * @example With className
 * ```tsx
 * <LogoSpinnerLazy
 *   size={150}
 *   className="mx-auto mt-4"
 *   onLoad={() => {}}
 * />
 * ```
 */
export function LogoSpinnerLazy(props: LogoSpinnerProps) {
  return (
    <Suspense fallback={<LoadingFallback size={props.size} />}>
      <LogoSpinner {...props} />
    </Suspense>
  );
}

/**
 * Lazy-loaded 3D Logo Spinner (Shadow DOM 버전)
 *
 * Chrome Extension의 Shadow DOM 환경에서 사용하는 버전입니다.
 * Three.js 번들을 동적으로 로드하여 초기 로딩 성능을 개선합니다.
 *
 * @example
 * ```tsx
 * // Shadow DOM 환경 (LoginPrompt.tsx)
 * <LogoSpinnerShadowLazy size={120} rotationSpeed={0.6} />
 * ```
 */
export function LogoSpinnerShadowLazy(props: Omit<LogoSpinnerProps, 'className'>) {
  return (
    <Suspense fallback={<LoadingFallback size={props.size} />}>
      <LogoSpinnerShadow {...props} />
    </Suspense>
  );
}

/**
 * 텍스처 프리로드 함수 (Lazy 버전)
 *
 * 컴포넌트 마운트 전에 텍스처를 미리 로드하려면
 * 먼저 LogoSpinner 모듈을 동적으로 import해야 합니다.
 *
 * @example
 * ```tsx
 * // App 진입점에서 호출
 * preloadLogoSpinner().then(() => {
 *   // 프리로드 완료
 * });
 * ```
 */
export async function preloadLogoSpinner() {
  try {
    const module = await import('./LogoSpinner');
    module.preloadLogoTexture();
    return true;
  } catch (error) {
    console.error('Failed to preload logo spinner:', error);
    return false;
  }
}

/**
 * 컴포넌트 프리로드 (번들 다운로드만)
 *
 * 사용자가 로딩 스피너를 볼 가능성이 높을 때
 * 미리 Three.js 번들을 다운로드해둡니다.
 *
 * @example
 * ```tsx
 * // 사용자가 특정 페이지에 진입했을 때
 * useEffect(() => {
 *   preloadLogoSpinnerComponent();
 * }, []);
 * ```
 */
export function preloadLogoSpinnerComponent() {
  // React.lazy는 자동으로 캐싱하므로 단순히 import만 실행
  import('./LogoSpinner').catch((error) => {
    console.error('Failed to preload LogoSpinner component:', error);
  });
}

/**
 * Shadow DOM 버전 프리로드
 */
export function preloadLogoSpinnerShadowComponent() {
  import('./LogoSpinnerShadow').catch((error) => {
    console.error('Failed to preload LogoSpinnerShadow component:', error);
  });
}
