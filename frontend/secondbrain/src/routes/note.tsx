import { createFileRoute } from '@tanstack/react-router';
import { NoteEditor } from '@/features/note/components/NoteEditor';

export const Route = createFileRoute('/note')({
  component: NotePageComponent,
});

function NotePageComponent() {
  return (
    <div className="min-h-dvh w-full bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Note Editor</h1>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <NoteEditor />
        </div>
      </div>
    </div>
  );
}
