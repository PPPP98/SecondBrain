import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { NoteLayout } from '@/layouts/NoteLayout';
import { NoteTitleInput } from '@/features/note/components/NoteTitleInput';
import { NoteEditor } from '@/features/note/components/NoteEditor';
import { ToggleSwitch } from '@/shared/components/ToggleSwitch/ToggleSwitch';
import { GlassElement } from '@/shared/components/GlassElement/GlassElement';
import LogoIcon from '@/shared/components/icon/Logo.svg?react';
import '@/shared/styles/custom-scrollbar.css';

export const Route = createFileRoute('/note')({
  component: NotePageComponent,
});

/**
 * NotePage 컴포넌트
 * - NoteLayout 사용 (BackArrow, DeleteIcon, PlusIcon 자동 제공)
 * - Logo: BackArrow 옆 추가
 * - ToggleSwitch: DeleteIcon 옆 추가 (리마인드 기능)
 * - NoteTitleInput + NoteEditor 중앙 배치
 * - 스크린샷 UI 스타일 완전 재현
 */
function NotePageComponent() {
  const [title, setTitle] = useState('');
  const [isReminder, setIsReminder] = useState(false);
  // TODO: NoteEditor에서 content 추출 및 저장 기능 구현
  // const [content, setContent] = useState('');

  function handleToggleReminder(checked: boolean) {
    setIsReminder(checked);
    // TODO: API 호출하여 리마인드 설정 저장
    console.log('리마인드 설정:', checked);
  }

  return (
    <NoteLayout>
      {/* 좌측 상단: BackArrow 옆 Logo (BackArrow는 NoteLayout이 제공) */}
      <div className="fixed left-[120px] top-10 z-10">
        <GlassElement
          as="button"
          icon={<LogoIcon className="size-8" />}
          aria-label="Second Brain Logo"
        />
      </div>

      {/* 우측 상단: DeleteIcon 옆 ToggleSwitch (DeleteIcon은 NoteLayout이 제공) */}
      <div className="fixed right-[120px] top-10 z-10 flex h-14 items-center gap-3">
        <span className="text-sm font-medium text-white">리마인드</span>
        <ToggleSwitch checked={isReminder} onChange={handleToggleReminder} />
      </div>

      {/* 중앙 컨텐츠: Title + Editor (Page 전체 스크롤) */}
      <div className="custom-scrollbar absolute inset-x-0 bottom-0 top-32 flex flex-col items-center gap-8 overflow-y-auto px-32">
        {/* 컨텐츠 영역 - Notion 스타일 최대 너비 제한 */}
        <div className="flex w-full max-w-[900px] flex-col">
          {/* 제목 입력 */}
          <NoteTitleInput value={title} onChange={setTitle} placeholder="제목을 입력해주세요..." />

          {/* 마크다운 에디터 */}
          <div className="pb-20">
            <NoteEditor defaultValue="" />
          </div>
        </div>
      </div>
    </NoteLayout>
  );
}
