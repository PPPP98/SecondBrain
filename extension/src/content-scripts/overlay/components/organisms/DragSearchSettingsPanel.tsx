import React, { useEffect, useState } from 'react';
import { Settings, Plus, X, ChevronLeft } from 'lucide-react';
import type { DragSearchSettings } from '@/types/dragSearch';
import browser from 'webextension-polyfill';

interface DragSearchSettingsPanelProps {
  onClose?: () => void;
}

/**
 * 드래그 검색 설정 패널
 * 자동 검색 On/Off, 최소 텍스트 길이, 제외 도메인 관리
 */
export const DragSearchSettingsPanel: React.FC<DragSearchSettingsPanelProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<DragSearchSettings>({
    enabled: true,
    minTextLength: 2,
    debounceMs: 300,
    autoHideMs: 3000,
    excludedDomains: [],
  });

  const [newDomain, setNewDomain] = useState('');

  // 설정 로드
  useEffect(() => {
    void browser.storage.local.get(['dragSearchSettings']).then((result) => {
      if (result.dragSearchSettings) {
        setSettings(result.dragSearchSettings as DragSearchSettings);
      }
    });
  }, []);

  // 설정 변경 핸들러
  const handleSettingChange = async <K extends keyof DragSearchSettings>(
    key: K,
    value: DragSearchSettings[K],
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await browser.storage.local.set({ dragSearchSettings: newSettings });

    // Content Script에 설정 변경 알림
    window.postMessage({ type: 'DRAG_SEARCH_SETTINGS_UPDATED', settings: newSettings }, '*');
  };

  // 도메인 추가
  const handleAddDomain = () => {
    if (newDomain && !settings.excludedDomains.includes(newDomain)) {
      void handleSettingChange('excludedDomains', [...settings.excludedDomains, newDomain]);
      setNewDomain('');
    }
  };

  // 도메인 제거
  const handleRemoveDomain = (domain: string) => {
    void handleSettingChange(
      'excludedDomains',
      settings.excludedDomains.filter((d) => d !== domain),
    );
  };

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">드래그 검색 설정</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
            title="닫기"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 자동 검색 활성화 */}
      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="drag-search-enabled" className="font-medium text-gray-700">
            자동 검색 활성화
          </label>
          <p className="mt-1 text-xs text-gray-500">텍스트 드래그 시 자동으로 검색 버튼 표시</p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            id="drag-search-enabled"
            checked={settings.enabled}
            onChange={(e) => void handleSettingChange('enabled', e.target.checked)}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
        </label>
      </div>

      {/* 최소 텍스트 길이 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="min-text-length" className="font-medium text-gray-700">
          최소 텍스트 길이
        </label>
        <div className="flex items-center gap-3">
          <input
            id="min-text-length"
            type="number"
            min={1}
            max={10}
            value={settings.minTextLength}
            onChange={(e) => void handleSettingChange('minTextLength', Number(e.target.value))}
            className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
          <span className="text-sm text-gray-600">
            {settings.minTextLength}자 이상 드래그 시 검색
          </span>
        </div>
      </div>

      {/* 자동 숨김 시간 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="auto-hide-ms" className="font-medium text-gray-700">
          검색 버튼 표시 시간 (초)
        </label>
        <div className="flex items-center gap-3">
          <input
            id="auto-hide-ms"
            type="number"
            min={1}
            max={10}
            value={settings.autoHideMs / 1000}
            onChange={(e) => void handleSettingChange('autoHideMs', Number(e.target.value) * 1000)}
            className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
          <span className="text-sm text-gray-600">{settings.autoHideMs / 1000}초 후 자동 숨김</span>
        </div>
      </div>

      {/* 제외 도메인 */}
      <div className="flex flex-col gap-3">
        <label className="font-medium text-gray-700">제외할 웹사이트</label>
        <p className="-mt-2 text-xs text-gray-500">
          이 도메인에서는 드래그 검색이 작동하지 않습니다
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="example.com"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
          <button
            onClick={handleAddDomain}
            disabled={!newDomain}
            className="flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <Plus className="h-4 w-4" />
            추가
          </button>
        </div>

        {settings.excludedDomains.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {settings.excludedDomains.map((domain) => (
              <div
                key={domain}
                className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm"
              >
                <span className="text-gray-700">{domain}</span>
                <button
                  onClick={() => handleRemoveDomain(domain)}
                  className="text-gray-500 transition-colors hover:text-red-600"
                  title={`${domain} 제거`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
