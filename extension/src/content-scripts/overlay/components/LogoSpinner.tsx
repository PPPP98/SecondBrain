import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { LogoSpinnerProps, RotatingLogoProps } from '@/types/spinner.types';

// 텍스처 프리로드 (컴포넌트 외부에서 실행)
useTexture.preload('/Logo_upscale.png');

/**
 * 회전하는 3D 로고 구체 컴포넌트
 * 내부에서 실제 Three.js 메쉬를 렌더링
 */
function RotatingLogo({ rotationSpeed, metalness, roughness, onLoad }: RotatingLogoProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // 텍스처 로드 (Drei의 useTexture 사용 - 자동 캐싱)
  const texture = useTexture('/Logo_upscale.png');

  // 지오메트리 메모이제이션 (재사용)
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 64, 64), []);

  // 재질 메모이제이션
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        metalness,
        roughness,
      }),
    [texture, metalness, roughness],
  );

  // 회전 애니메이션 (useFrame으로 매 프레임 호출)
  useFrame((_state, delta) => {
    if (meshRef.current) {
      // Y축 회전 (주 회전)
      meshRef.current.rotation.y += delta * rotationSpeed;
      // X축 회전 (보조 회전, 더 천천히)
      meshRef.current.rotation.x += delta * (rotationSpeed * 0.3);
    }
  });

  // 텍스처 로딩 완료 알림
  useEffect(() => {
    if (texture && onLoad) {
      onLoad();
    }
  }, [texture, onLoad]);

  // 언마운트 시 리소스 해제
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      if (texture) {
        texture.dispose();
      }
    };
  }, [geometry, material, texture]);

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

/**
 * Suspense Fallback 컴포넌트
 * 3D 씬 로딩 중 표시할 간단한 CSS 스피너
 */
function SimpleFallback({ size }: { size: number }) {
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
        style={{
          width: size * 0.3,
          height: size * 0.3,
        }}
      />
    </div>
  );
}

/**
 * 3D Logo Spinner 메인 컴포넌트
 *
 * @example
 * ```tsx
 * <LogoSpinner size={200} rotationSpeed={0.8} />
 * ```
 *
 * @example With callback
 * ```tsx
 * <LogoSpinner
 *   size={150}
 *   onLoad={() => console.log('Loaded!')}
 *   onError={(err) => console.error(err)}
 * />
 * ```
 */
export function LogoSpinner({
  size = 200,
  rotationSpeed = 0.8,
  className = '',
  metalness = 0.3,
  roughness = 0.4,
  onLoad,
  onError,
}: LogoSpinnerProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Canvas
        // 필요시에만 렌더링 (성능 최적화)
        frameloop="demand"
        // 디바이스 픽셀 비율 제한 (고해상도 화면 최적화)
        dpr={[1, 2]}
        // 안티앨리어싱 비활성화 (로딩 스피너는 불필요)
        gl={{ antialias: false }}
        // 카메라 설정
        camera={{ position: [0, 0, 3], fov: 50 }}
        // 에러 처리
        onCreated={(state) => {
          // WebGL 컨텍스트 생성 실패 감지
          if (!state.gl) {
            onError?.(new Error('WebGL context creation failed'));
          }
        }}
      >
        {/* Suspense로 비동기 로딩 관리 */}
        <Suspense fallback={null}>
          {/* 환경광 (전체 조명) */}
          <ambientLight intensity={0.6} />

          {/* 방향광 (그림자와 하이라이트) */}
          <directionalLight position={[5, 5, 5]} intensity={0.8} />

          {/* 회전하는 로고 구체 */}
          <RotatingLogo
            rotationSpeed={rotationSpeed}
            metalness={metalness}
            roughness={roughness}
            onLoad={onLoad}
          />
        </Suspense>
      </Canvas>

      {/* Canvas 로딩 중 표시할 폴백 (외부) */}
      <Suspense fallback={<SimpleFallback size={size} />} />
    </div>
  );
}

/**
 * 프리로드 유틸리티
 * 컴포넌트 마운트 전에 텍스처를 미리 로드
 *
 * @example
 * ```tsx
 * // App 최상위에서 호출
 * preloadLogoTexture();
 * ```
 */
export function preloadLogoTexture() {
  useTexture.preload('/Logo_upscale.png');
}
