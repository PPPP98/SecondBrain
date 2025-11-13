/**
 * CSS Radial Gradient 기반 3D 구체 스피너
 * Chrome Extension Content Script 환경 호환
 *
 * 다층 radial gradient로 진짜 구체처럼 보이는 입체 효과 구현:
 * - 메인 레이어: 로고 이미지 + 구체 음영
 * - ::before: 하단 조명 효과
 * - ::after: 상단 하이라이트 (광택)
 */

interface LogoSpinnerCSSProps {
  /**
   * 스피너 크기 (픽셀)
   * @default 120
   */
  size?: number;

  /**
   * 회전 애니메이션 속도 (초)
   * @default 4
   */
  duration?: number;

  /**
   * Tailwind 클래스
   */
  className?: string;
}

/**
 * Radial Gradient 기반 사실적인 3D 구체 스피너
 *
 * 3개 레이어 구조로 진짜 구체처럼 보이는 입체감:
 * 1. 메인: 로고 + 구체 음영 (하단 조명)
 * 2. 하이라이트: 부드러운 하단 반사광
 * 3. 광택: 날카로운 상단 반짝임
 *
 * @example
 * ```tsx
 * <LogoSpinnerCSS size={120} duration={4} />
 * ```
 */
export function LogoSpinnerCSS({ size = 120, duration = 4, className = '' }: LogoSpinnerCSSProps) {
  // 고유 ID (multiple instances용)
  const uniqueId = `sphere-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={className}
      style={{
        perspective: '1000px',
        width: size,
        height: size,
        position: 'relative',
      }}
    >
      {/* 회전 컨테이너 */}
      <div
        className={uniqueId}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          animation: `rotate3d-${uniqueId} ${duration}s linear infinite`,
        }}
      >
        {/* 구체 메인 레이어 */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            position: 'relative',
            // 로고 이미지 (Chrome Extension 리소스)
            backgroundImage: `url('${chrome.runtime.getURL('Logo_upscale.png')}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            // 구체 음영 (하단에서 조명)
            boxShadow: `
              inset 0 0 ${size * 0.5}px rgba(0, 0, 0, 0.5),
              inset ${size * 0.3}px ${size * 0.3}px ${size * 0.3}px rgba(0, 0, 0, 0.3),
              inset -${size * 0.2}px -${size * 0.2}px ${size * 0.2}px rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          {/* 하단 조명 하이라이트 (부드러운 반사광) */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `radial-gradient(
                circle at 50% 120%,
                rgba(255, 255, 255, 0.4),
                rgba(255, 255, 255, 0) 70%
              )`,
              filter: `blur(${size * 0.05}px)`,
            }}
          />

          {/* 상단 광택 (날카로운 하이라이트) */}
          <div
            style={{
              position: 'absolute',
              width: '60%',
              height: '60%',
              top: '5%',
              left: '10%',
              borderRadius: '50%',
              background: `radial-gradient(
                circle at 50% 50%,
                rgba(255, 255, 255, 0.7),
                rgba(255, 255, 255, 0.3) 40%,
                rgba(255, 255, 255, 0) 70%
              )`,
              transform: 'translateX(-10%) translateY(-10%) skewX(-15deg) rotate(-20deg)',
              filter: `blur(${size * 0.08}px)`,
            }}
          />
        </div>
      </div>

      {/* CSS 애니메이션 정의 */}
      <style>{`
        @keyframes rotate3d-${uniqueId} {
          0% {
            transform: rotateY(0deg) rotateX(15deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(15deg);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * 향상된 3D 효과를 가진 로고 스피너
 * 여러 레이어로 더 입체감 있는 구체 효과
 */
export function LogoSpinnerCSS3D({
  size = 120,
  duration = 4,
  className = '',
}: LogoSpinnerCSSProps) {
  const layers = [
    { scale: 1.0, opacity: 1.0, z: 0 },
    { scale: 0.9, opacity: 0.7, z: -10 },
    { scale: 0.8, opacity: 0.5, z: -20 },
  ];

  return (
    <div className={className} style={{ perspective: '1000px', width: size, height: size }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          animation: `rotate3dEnhanced ${duration}s ease-in-out infinite`,
        }}
      >
        {layers.map((layer, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${size * layer.scale}px`,
              height: `${size * layer.scale}px`,
              marginLeft: `-${(size * layer.scale) / 2}px`,
              marginTop: `-${(size * layer.scale) / 2}px`,
              borderRadius: '50%',
              background: `url('/Logo_upscale.png') center/cover`,
              opacity: layer.opacity,
              transform: `translateZ(${layer.z}px)`,
              boxShadow: `
                inset 0 0 ${20 * layer.scale}px rgba(0, 0, 0, 0.3),
                0 0 ${30 * layer.scale}px rgba(255, 255, 255, 0.1)
              `,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes rotate3dEnhanced {
          0% {
            transform: rotateY(0deg) rotateX(15deg);
          }
          50% {
            transform: rotateY(180deg) rotateX(-15deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(15deg);
          }
        }
      `}</style>
    </div>
  );
}
