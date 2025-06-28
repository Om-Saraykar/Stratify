// app/editor/[id]/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { PlateEditor } from "@/components/editor/plate-editor";
import prisma from "@/lib/prisma";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditorPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  console.log("id: ", id);
  console.log("session: ", session);
  console.log("session.user.id: ", session?.user?.id);

  const notebook = await prisma.notebook.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });
  console.log("notebook: ", notebook)

  if (!notebook) {
    redirect("/dashboard/notes");
  }

  return (
    <div className="h-screen w-full">
      <PlateEditor
        notebookId={notebook.id}
        initialContent={
          Array.isArray(notebook.content)
            ? notebook.content
            : typeof notebook.content === 'string'
              ? JSON.parse(notebook.content)
              : [{ type: 'p', children: [{ text: '' }] }]
        }
        initialTitle={notebook.title}
      />

      <Toaster />
    </div>
  );
}
