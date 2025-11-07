import { type ReactNode } from 'react';

interface SidePeekOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Side Peek 공통 오버레이 컨테이너
 * - 배경 오버레이 (클릭 시 닫기)
 * - 슬라이드 애니메이션 (왼쪽→오른쪽)
 * - TailwindCSS transform 사용
 */
export function SidePeekOverlay({ isOpen, onClose, children }: SidePeekOverlayProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'} `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Peek 패널 */}
      <div
        className={`fixed right-0 top-0 z-[110] size-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} `}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </>
  );
}
