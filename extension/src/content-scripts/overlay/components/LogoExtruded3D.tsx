import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

interface LogoExtruded3DProps {
  /**
   * 스피너 크기 (픽셀)
   * @default 120
   */
  size?: number;

  /**
   * 회전 속도
   * @default 0.5
   */
  rotationSpeed?: number;

  /**
   * 압출 깊이 (3D 두께)
   * @default 15
   */
  extrudeDepth?: number;

  /**
   * Tailwind 클래스
   */
  className?: string;

  /**
   * 로딩 완료 콜백
   */
  onLoad?: () => void;

  /**
   * 에러 콜백
   */
  onError?: (error: Error) => void;
}

/**
 * SVG를 3D로 압출한 로고 메쉬
 * SVGLoader로 SVG 로드 → Shapes 변환 → ExtrudeGeometry로 3D화
 */
function ExtrudedLogoMesh({
  rotationSpeed,
  extrudeDepth,
  onLoad,
}: {
  rotationSpeed: number;
  extrudeDepth: number;
  onLoad?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // SVG 로드 (Chrome Extension 리소스)
  const svgData = useLoader(SVGLoader, chrome.runtime.getURL('Logo.svg'));

  // SVG paths → Three.js Shapes 변환 (2025 권장 방법)
  const shapes = useMemo(() => {
    return svgData.paths.flatMap((path) => SVGLoader.createShapes(path));
  }, [svgData]);

  // ExtrudeGeometry 생성 (3D 압출)
  const geometry = useMemo(() => {
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: extrudeDepth,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1,
      bevelSegments: 3,
    };

    const geo = new THREE.ExtrudeGeometry(shapes, extrudeSettings);

    // 중앙 정렬 (필수!)
    geo.center();

    return geo;
  }, [shapes, extrudeDepth]);

  // 회전 애니메이션
  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
      groupRef.current.rotation.x += delta * (rotationSpeed * 0.2);
    }
  });

  // 로딩 완료 알림
  useMemo(() => {
    if (geometry && onLoad) {
      onLoad();
    }
  }, [geometry, onLoad]);

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#4f46e5" // Indigo 색상
          metalness={0.3}
          roughness={0.4}
          flatShading={false}
        />
      </mesh>
    </group>
  );
}

/**
 * 간단한 CSS Fallback 스피너
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
 * SVG ExtrudeGeometry 기반 3D 로고 스피너
 *
 * SVG 벡터를 Three.js ExtrudeGeometry로 변환하여
 * 진짜 3D 입체 조형물을 생성합니다.
 *
 * @example
 * ```tsx
 * <LogoExtruded3D size={120} extrudeDepth={15} />
 * ```
 */
export function LogoExtruded3D({
  size = 120,
  rotationSpeed = 0.5,
  extrudeDepth = 15,
  className = '',
  onLoad,
  onError,
}: LogoExtruded3DProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        gl={{
          antialias: true, // ExtrudeGeometry는 안티앨리어싱 필요
          alpha: true,
          preserveDrawingBuffer: true,
        }}
        camera={{ position: [0, 0, 100], fov: 50 }}
        onCreated={(state) => {
          if (!state.gl) {
            onError?.(new Error('WebGL context creation failed'));
          }
        }}
      >
        <Suspense fallback={null}>
          {/* 3-Point Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -5, -5]} intensity={0.5} />

          {/* 3D 압출 로고 */}
          <ExtrudedLogoMesh
            rotationSpeed={rotationSpeed}
            extrudeDepth={extrudeDepth}
            onLoad={onLoad}
          />
        </Suspense>
      </Canvas>

      {/* 로딩 폴백 */}
      <Suspense fallback={<SimpleFallback size={size} />} />
    </div>
  );
}
