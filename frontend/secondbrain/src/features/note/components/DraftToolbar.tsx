import { GlassElement } from '@/shared/components/GlassElement/GlassElement';
import BackArrowIcon from '@/shared/components/icon/BackArrow.svg?react';
import DeleteIcon from '@/shared/components/icon/Delete.svg?react';

interface DraftToolbarProps {
  onBack: () => void;
  onDelete: () => void;
}

/**
 * Draft 툴바
 * - BackArrow: Side Peek 닫기
 * - Delete: Draft 삭제
 */
export function DraftToolbar({ onBack, onDelete }: DraftToolbarProps) {
  return (
    <>
      {/* 좌측 상단: 뒤로가기 */}
      <div className="fixed left-10 top-10 z-10">
        <GlassElement as="button" icon={<BackArrowIcon />} onClick={onBack} aria-label="닫기" />
      </div>

      {/* 우측 상단: 삭제 */}
      <div className="fixed right-10 top-10 z-10">
        <GlassElement as="button" icon={<DeleteIcon />} onClick={onDelete} aria-label="삭제" />
      </div>
    </>
  );
}
