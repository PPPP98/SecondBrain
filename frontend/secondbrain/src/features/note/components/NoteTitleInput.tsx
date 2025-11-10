import { forwardRef, useRef, useLayoutEffect } from 'react';

interface NoteTitleInputProps {
  defaultValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * 노트 제목 입력 컴포넌트 (Uncontrolled)
 * - React 공식: contenteditable은 uncontrolled component 권장
 * - key prop으로 상태 리셋 (외부에서 key 변경 시)
 * - useLayoutEffect로 초기값 설정 (렌더링 전 동기 실행)
 * - NotePage용 큰 제목 스타일 (투명 배경, 흰색 텍스트)
 * - contenteditable div로 구현하여 자동 높이 조절
 * - 줄바꿈 지원, HTML 입력 방지
 * - IME composition 완벽 지원 (한글, 일본어, 중국어)
 */
export const NoteTitleInput = forwardRef<HTMLDivElement, NoteTitleInputProps>(
  ({ defaultValue = '', onChange, placeholder = '제목을 입력해주세요...' }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const editableRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
    const isComposingRef = useRef(false);

    // 초기값 설정 및 동기화 (렌더링 전 동기 실행)
    // defaultValue 변경 시 업데이트하되, IME composition 중에는 스킵
    useLayoutEffect(() => {
      const div = editableRef.current;
      if (!div) return;

      // IME composition 중에는 업데이트 하지 않음 (커서 보존)
      if (isComposingRef.current) return;

      // 현재 내용과 defaultValue가 다를 때만 업데이트
      if (div.textContent !== defaultValue) {
        div.textContent = defaultValue;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]); // defaultValue 변경 시 동기화

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      // IME 입력 중에는 onChange 호출 안 함
      if (isComposingRef.current) return;

      const newValue = e.currentTarget.textContent || '';
      onChange(newValue);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      // 붙여넣기 시 텍스트만 허용 (HTML 제거)
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      // 엔터키는 줄바꿈만 허용 (submit 방지)
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        document.execCommand('insertLineBreak');
      }
    };

    return (
      <div
        ref={editableRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={(e) => {
          isComposingRef.current = false;
          // composition 종료 후 onChange 호출
          onChange(e.currentTarget.textContent || '');
        }}
        suppressContentEditableWarning
        role="textbox"
        aria-label="노트 제목"
        aria-multiline="true"
        data-placeholder={placeholder}
        className="mb-6 min-h-[50px] w-full border-0 bg-transparent font-bold text-white outline-none ring-0 empty:before:text-white/30 empty:before:content-[attr(data-placeholder)] focus:border-0 focus:outline-none focus:ring-0"
        style={{ fontSize: '42px', lineHeight: '1.2' }}
      />
    );
  },
);

NoteTitleInput.displayName = 'NoteTitleInput';
