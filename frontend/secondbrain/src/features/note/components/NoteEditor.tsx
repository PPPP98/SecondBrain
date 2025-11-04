import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

export function NoteEditor() {
  const editor = useCreateBlockNote();

  return (
    <div className="size-full">
      <BlockNoteView editor={editor} theme="light" />
    </div>
  );
}
