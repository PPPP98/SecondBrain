import { forwardRef } from 'react';

interface NoteTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * 노트 제목 입력 컴포넌트
 * - Notion 스타일 큰 제목 input
 * - 흰색 박스, placeholder
 * - Glass UI와 대비되는 디자인
 */
export const NoteTitleInput = forwardRef<HTMLInputElement, NoteTitleInputProps>(
  ({ value, onChange, placeholder = 'Untitled' }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-white px-6 py-4 text-2xl font-bold text-gray-800 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        aria-label="노트 제목"
      />
    );
  },
);

NoteTitleInput.displayName = 'NoteTitleInput';
