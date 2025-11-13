import { useState } from 'react';
import { Plus, Download, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/content-scripts/overlay/components/ui/button';
import browser from 'webextension-polyfill';
import type { SavePageResponse, SavePageError } from '@/types/note';

/**
 * 에러 코드를 사용자 친화적 메시지로 변환
 */
function getErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    NO_TOKEN: '로그인이 필요합니다',
    NO_TAB: '현재 탭을 찾을 수 없습니다',
    INVALID_URL: '이 페이지는 저장할 수 없습니다',
    API_ERROR: 'API 오류가 발생했습니다',
    NETWORK_ERROR: '네트워크 연결을 확인해주세요',
    UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다',
  };

  return errorMessages[errorCode] || errorMessages['UNKNOWN_ERROR'];
}

/**
 * Action Buttons (Molecule)
 * - 로그인 후 표시되는 액션 버튼들
 * - 페이지 추가, 저장 기능
 * - Shadcn UI + Tailwind CSS 기반
 */
export function ActionButtons() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  function handleAddPage(): void {
    // TODO: 페이지 추가 로직 구현
  }

  async function handleSave(): Promise<void> {
    // 1. 로딩 상태 시작
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // 2. Background Service Worker에 메시지 전송
      const rawResponse = await browser.runtime.sendMessage({
        type: 'SAVE_CURRENT_PAGE',
      });

      // 3. 응답 타입 검증
      const response = rawResponse as SavePageResponse | SavePageError;

      // 4. 에러 응답 처리
      if ('error' in response) {
        console.error('Save failed:', response);

        // 사용자 친화적 에러 메시지
        const errorMessage = getErrorMessage(response.error);
        alert(`❌ 저장 실패: ${errorMessage}`);
        return;
      }

      // 5. 성공 응답 처리
      console.log('✅ Page saved successfully:', response);

      // 성공 애니메이션 표시
      setSaveSuccess(true);

      // 2초 후 성공 상태 초기화
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      // 6. 예외 처리 (Background 통신 실패)
      console.error('Failed to save page:', error);
      alert('❌ 저장 실패: 확장 프로그램 오류');
    } finally {
      // 7. 로딩 상태 종료
      setIsSaving(false);
    }
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
        onClick={() => void handleSave()}
        disabled={isSaving}
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : saveSuccess ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}</span>
      </Button>
    </div>
  );
}
