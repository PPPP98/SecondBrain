import { useSearchPanelStore } from '@/features/main/stores/searchPanelStore';
import { PanelHeader } from '@/features/main/components/PanelHeader';

export function SearchPanel() {
  const mode = useSearchPanelStore((state) => state.mode);
  const query = useSearchPanelStore((state) => state.query);

  return (
    <div className="absolute left-0 top-0 z-40 flex h-full w-80 flex-col border-r border-white/20 bg-black/30 backdrop-blur-sm">
      <PanelHeader />
      <div className="flex-1 overflow-y-auto p-4">
        {mode === 'recent' && (
          <div className="text-white">
            <p className="text-sm text-white/60">최근 노트</p>
          </div>
        )}
        {mode === 'search' && (
          <div className="text-white">
            <p className="text-sm text-white/60">검색{query}</p>
          </div>
        )}
      </div>
    </div>
  );
}
