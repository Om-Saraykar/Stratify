import { Toaster } from 'sonner';

import { PlateEditor } from '@/components/editor/plate-editor';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';

export default async function NotesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-screen w-full">
      <PlateEditor isReadOnly={false} notebookId={''} initialTitle={''} initialContent={[]} />
      <Toaster />
    </div>
  );
}
