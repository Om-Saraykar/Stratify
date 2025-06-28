import { Toaster } from 'sonner';

import { PlateEditor } from '@/components/editor/plate-editor';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function NotesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-screen w-full">
      <PlateEditor notebookId={''} initialTitle={''} initialContent={[]} />
      <Toaster />
    </div>
  );
}
