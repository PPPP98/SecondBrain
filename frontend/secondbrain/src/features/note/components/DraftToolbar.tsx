import { ChevronsRight, PanelRightClose, Trash2, Expand, X } from 'lucide-react';

interface DraftToolbarProps {
  onBack: () => void;
  onDelete: () => void;
  mode: 'full-screen' | 'side-peek';
  onToggleMode: () => void;
}

/**
 * Draft 툴바
 * - 전체화면 모드: ChevronsRight (닫기), PanelRightClose (부분화면 전환), Trash2 (삭제)
 * - 부분화면 모드: BackArrow (닫기), Trash2 (삭제)
 * - GlassElement 제거, Tailwind로 Glass 효과 직접 구현
 */
export function DraftToolbar({ onBack, onDelete, mode, onToggleMode }: DraftToolbarProps) {
  // 공통 버튼 스타일
  const buttonClass = `
    rounded-lg border border-white/30 bg-white/10 p-3
    backdrop-blur-lg transition-colors
    hover:bg-white/20 active:bg-white/30
  `;

  return (
    <>
      {mode === 'full-screen' ? (
        // 전체화면 모드: 우측 상단에 3개 버튼
        <div className="fixed right-10 top-10 z-10 flex gap-3">
          <button onClick={onBack} className={buttonClass} aria-label="닫기">
            <ChevronsRight className="size-6 text-white" />
          </button>

          <button onClick={onToggleMode} className={buttonClass} aria-label="부분 화면으로 전환">
            <PanelRightClose className="size-6 text-white" />
          </button>

          <button onClick={onDelete} className={buttonClass} aria-label="삭제">
            <Trash2 className="size-6 text-white" />
          </button>
        </div>
      ) : (
        // 부분화면 모드: 좌측 Expand (전체화면 전환), 우측 X (닫기) + Delete
        <>
          <div className="fixed left-10 top-10 z-10">
            <button onClick={onToggleMode} className={buttonClass} aria-label="전체화면으로 전환">
              <Expand className="size-6 text-white" />
            </button>
          </div>

          <div className="fixed right-10 top-10 z-10 flex gap-3">
            <button onClick={onBack} className={buttonClass} aria-label="닫기">
              <X className="size-6 text-white" />
            </button>

            <button onClick={onDelete} className={buttonClass} aria-label="삭제">
              <Trash2 className="size-6 text-white" />
            </button>
          </div>
        </>
      )}
    </>
  );
}
