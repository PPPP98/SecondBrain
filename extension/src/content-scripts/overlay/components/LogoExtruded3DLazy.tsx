import { lazy, Suspense } from 'react';
import type { CSSProperties } from 'react';

/**
 * Dynamic Import로 LogoExtruded3D 지연 로딩
 * Three.js + SVGLoader 번들을 필요시에만 로드
 */
const LogoExtruded3D = lazy(() =>
  import('./LogoExtruded3D').then((module) => ({
    default: module.LogoExtruded3D,
  })),
);

/**
 * 로딩 중 표시할 CSS 스피너
 */
function LoadingFallback({ size = 120 }: { size?: number }) {
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
    borderTopColor: '#6366f1',
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
 * Lazy-loaded SVG Extruded 3D Logo Spinner
 *
 * SVG를 ExtrudeGeometry로 압출하여 진짜 3D 입체 조형물 생성
 * Three.js 번들을 동적으로 로드하여 초기 성능 최적화
 *
 * @example
 * ```tsx
 * <LogoExtruded3DLazy
 *   size={120}
 *   extrudeDepth={15}
 *   rotationSpeed={0.5}
 * />
 * ```
 */
export function LogoExtruded3DLazy(props: {
  size?: number;
  rotationSpeed?: number;
  extrudeDepth?: number;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}) {
  return (
    <Suspense fallback={<LoadingFallback size={props.size} />}>
      <LogoExtruded3D {...props} />
    </Suspense>
  );
}
