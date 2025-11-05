import { createFileRoute } from '@tanstack/react-router';
import { MilkdownEditor } from '@/features/note/components/MilkdownEditor';

export const Route = createFileRoute('/note-milkdown')({
  component: NoteMilkdownPageComponent,
});

function NoteMilkdownPageComponent() {
  return <MilkdownEditor />;
}
