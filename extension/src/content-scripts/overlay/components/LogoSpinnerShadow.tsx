import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import * as THREE from 'three';
import type { LogoSpinnerProps, RotatingLogoProps } from '@/types/spinner.types';

// 텍스처 프리로드
useTexture.preload('/Logo_upscale.png');

/**
 * 회전하는 3D 로고 구체 컴포넌트
 * (Shadow DOM 버전과 동일한 로직)
 */
function RotatingLogo({ rotationSpeed, metalness, roughness, onLoad }: RotatingLogoProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture('/Logo_upscale.png');

  const geometry = useMemo(() => new THREE.SphereGeometry(1, 64, 64), []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        metalness,
        roughness,
      }),
    [texture, metalness, roughness],
  );

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
      meshRef.current.rotation.x += delta * (rotationSpeed * 0.3);
    }
  });

  useEffect(() => {
    if (texture && onLoad) {
      onLoad();
    }
  }, [texture, onLoad]);

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
 * Suspense Fallback (Shadow DOM 호환 인라인 스타일)
 */
function SimpleFallback({ size }: { size: number }) {
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
    border: '4px solid #d1d5db',
    borderTopColor: '#2563eb',
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
 * Shadow DOM 호환 3D Logo Spinner
 * Chrome Extension의 Shadow DOM 환경에서 사용
 *
 * @example
 * ```tsx
 * // LoginPrompt.tsx에서 사용
 * <LogoSpinnerShadow size={120} rotationSpeed={0.6} />
 * ```
 */
export function LogoSpinnerShadow({
  size = 200,
  rotationSpeed = 0.8,
  metalness = 0.3,
  roughness = 0.4,
  onLoad,
  onError,
}: Omit<LogoSpinnerProps, 'className'>) {
  const containerStyle: CSSProperties = {
    width: size,
    height: size,
    position: 'relative',
  };

  return (
    <div style={containerStyle}>
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'default',
        }}
        camera={{ position: [0, 0, 3], fov: 50 }}
        onCreated={(state) => {
          if (!state.gl) {
            onError?.(new Error('WebGL context creation failed'));
          }
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <RotatingLogo
            rotationSpeed={rotationSpeed}
            metalness={metalness}
            roughness={roughness}
            onLoad={onLoad}
          />
        </Suspense>
      </Canvas>

      <Suspense fallback={<SimpleFallback size={size} />} />
    </div>
  );
}

/**
 * 프리로드 유틸리티 (Shadow DOM 버전)
 */
export function preloadLogoTexture() {
  useTexture.preload('/Logo_upscale.png');
}
