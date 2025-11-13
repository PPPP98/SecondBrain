import { Plus, Download } from 'lucide-react';
import { Button } from '@/content-scripts/overlay/components/ui/button';

/**
 * Action Buttons (Molecule)
 * - 로그인 후 표시되는 액션 버튼들
 * - 페이지 추가, 저장 기능
 * - Shadcn UI + Tailwind CSS 기반
 */
export function ActionButtons() {
  function handleAddPage(): void {
    console.log('Add page:', window.location.href);
    // TODO: 페이지 추가 로직 구현
  }

  function handleSave(): void {
    console.log('Save page:', window.location.href);
    // TODO: 저장 로직 구현
  }

  return (
    <div className="w-[260px] space-y-2 rounded-xl border border-border bg-card p-4 shadow-lg">
      <Button
        variant="outline"
        className="w-full justify-start gap-2 hover:bg-accent"
        onClick={handleAddPage}
      >
        <Plus className="h-4 w-4" />
        <span>Add</span>
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start gap-2 hover:bg-accent"
        onClick={handleSave}
      >
        <Download className="h-4 w-4" />
        <span>Save</span>
      </Button>
    </div>
  );
}
