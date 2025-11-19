import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

interface Loading3DProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  animationType?: 'rotate' | 'pulse' | 'float';
  color?: string;
}

const SIZE_CONFIG = {
  sm: { dimension: 64, cameraZ: 100 },
  md: { dimension: 96, cameraZ: 120 },
  lg: { dimension: 128, cameraZ: 140 },
} as const;

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

export function Loading3D({
  size = 'md',
  message,
  animationType = 'rotate',
  color = '#6366f1',
}: Loading3DProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { dimension, cameraZ } = SIZE_CONFIG[size];

    // Scene 설정
    const scene = new THREE.Scene();

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = cameraZ;

    // Renderer 설정
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(dimension, dimension);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    // SVG 로드 및 3D 메시 생성
    const loader = new SVGLoader();
    const svgUrl = '/src/shared/components/icon/Logo.svg';

    loader.load(
      svgUrl,
      (data) => {
        const paths = data.paths;
        const group = new THREE.Group();

        // ExtrudeGeometry 설정
        const extrudeSettings = {
          depth: 8,
          bevelEnabled: true,
          bevelThickness: 1,
          bevelSize: 0.5,
          bevelSegments: 3,
          curveSegments: 12,
        };

        // 재질 설정
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          metalness: 0.3,
          roughness: 0.4,
          side: THREE.DoubleSide,
        });

        // SVG 경로를 3D 메시로 변환
        for (const path of paths) {
          const shapes = SVGLoader.createShapes(path);

          for (const shape of shapes) {
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);
          }
        }

        // 바운딩 박스 계산하여 중앙 정렬
        const box = new THREE.Box3().setFromObject(group);
        const center = box.getCenter(new THREE.Vector3());
        const boxSize = box.getSize(new THREE.Vector3());

        // 중앙 정렬
        group.position.x = -center.x;
        group.position.y = -center.y;
        group.position.z = -center.z;

        // SVG 좌표계 보정 (Y축 반전)
        group.scale.y *= -1;

        // 적절한 크기로 스케일링
        const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
        const scale = 40 / maxDim;
        group.scale.multiplyScalar(scale);

        scene.add(group);
        meshGroupRef.current = group;
      },
      undefined,
      (error) => {
        console.error('SVG 로드 실패:', error);
      },
    );

    // 애니메이션 루프
    let time = 0;
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      time += 0.016;

      if (meshGroupRef.current) {
        if (animationType === 'rotate') {
          meshGroupRef.current.rotation.y += 0.02;
        } else if (animationType === 'pulse') {
          const pulseScale = 1 + Math.sin(time * 3) * 0.1;
          meshGroupRef.current.scale.setScalar(pulseScale * (40 / 100));
          meshGroupRef.current.rotation.y += 0.01;
        } else if (animationType === 'float') {
          meshGroupRef.current.position.y = Math.sin(time * 2) * 5;
          meshGroupRef.current.rotation.y += 0.015;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 클린업
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }

      // 지오메트리 및 재질 정리
      if (meshGroupRef.current) {
        meshGroupRef.current.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.isMesh) {
            if (mesh.geometry) {
              mesh.geometry.dispose();
            }
            if (mesh.material instanceof THREE.Material) {
              mesh.material.dispose();
            } else if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m: THREE.Material) => m.dispose());
            }
          }
        });
      }
    };
  }, [size, animationType, color]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div
        ref={containerRef}
        className={`${SIZE_CLASSES[size]} relative`}
        role="status"
        aria-label="Loading"
      />
      {message && <p className="text-sm text-white/80">{message}</p>}
    </div>
  );
}
