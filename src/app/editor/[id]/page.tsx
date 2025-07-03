import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { PlateEditor } from "@/components/editor/plate-editor";
import prisma from "@/lib/prisma";

// Next.js 15+ page params are a Promise!
interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditorPage(props: Props) {
  const { params } = props;
  const { id } = await params; // Await the promise

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const notebook = await prisma.notebook.findUnique({
    where: { id: id },
    include: {
      SharedNotebook: {
        where: {
          userId: session.user.id,
        },
        select: {
          access: true,
        },
      },
    },
  });

  if (!notebook) {
    redirect("/dashboard/notes");
  }

  const isOwner = notebook.userId === session.user.id;
  const sharedAccess = notebook.SharedNotebook[0]?.access;
  const isReadOnly = !isOwner && sharedAccess !== "EDIT";

  return (
    <div className="h-screen w-full">
      <PlateEditor
        notebookId={notebook.id}
        initialContent={
          Array.isArray(notebook.content)
            ? notebook.content
            : typeof notebook.content === "string"
              ? JSON.parse(notebook.content)
              : [{ type: "p", children: [{ text: "" }] }]
        }
        initialTitle={notebook.title}
        isReadOnly={isReadOnly}
      />
      <Toaster />
    </div>
  );
}
