import { useSearchPanelStore } from '@/features/main/stores/searchPanelStore';
import DoubleArrow from '@/shared/components/icon/DoubleArrow.svg?react';

export function PanelHeader() {
  const closePanel = useSearchPanelStore((state) => state.closePanel);

  return (
    <div className="flex items-center justify-between p-4">
      <div className="size-8" />
      <button
        onClick={closePanel}
        className="flex size-8 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <DoubleArrow />
      </button>
    </div>
  );
}
