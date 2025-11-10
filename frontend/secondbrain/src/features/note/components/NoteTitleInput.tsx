import { forwardRef, useRef, useEffect } from 'react';

interface NoteTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * 노트 제목 입력 컴포넌트 (Controlled textarea)
 * - TanStack Query와 완벽 통합 (Controlled component)
 * - textarea 기반으로 자동 높이 조절
 * - IME composition 완벽 지원 (React가 자동 처리)
 * - NotePage용 큰 제목 스타일 (투명 배경, 흰색 텍스트)
 * - 줄바꿈 지원
 */
export const NoteTitleInput = forwardRef<HTMLTextAreaElement, NoteTitleInputProps>(
  ({ value, onChange, placeholder = '제목을 입력해주세요...' }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    // 자동 높이 조절
    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // 높이 초기화 후 scrollHeight로 재설정
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    };

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={1}
        className="mb-6 w-full resize-none overflow-hidden border-0 bg-transparent font-bold text-white outline-none ring-0 placeholder:text-white/30 focus:border-0 focus:outline-none focus:ring-0"
        style={{
          fontSize: '42px',
          lineHeight: '1.2',
          minHeight: '50px',
        }}
        aria-label="노트 제목"
      />
    );
  },
);

NoteTitleInput.displayName = 'NoteTitleInput';
