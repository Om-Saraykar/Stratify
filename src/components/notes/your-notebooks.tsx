"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loader";
import { SkeletonCard } from "@/components/notes/your-notebooks-skeleton";
import ShareNotebookDialog from "@/components/notes/share-notebook-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, Share2 } from "lucide-react";

type Notebook = {
  id: string;
  title: string;
  content: any;
  createdAt: string;
};

export default function YourNotebooks() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null); 

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch notebooks
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchNotebooks = async () => {
      setLoading(true);
      const res = await fetch(`/api/notebooks`);
      const data = await res.json();
      setNotebooks(data);
      setLoading(false);
    };

    fetchNotebooks();
  }, [status]);

  const createNotebook = async () => {
    const res = await fetch("/api/notebooks", {
      method: "POST",
      body: JSON.stringify({ title: newTitle || "Untitled", content: [] }),
      headers: { "Content-Type": "application/json" },
    });

    const created = await res.json();
    setNotebooks([created, ...notebooks]);
    setNewTitle("");
  };

  const deleteNotebook = async (id: string) => {
    await fetch(`/api/notebooks/${id}`, { method: "DELETE" });
    setNotebooks(notebooks.filter((n) => n.id !== id));
  };

  if (status === "loading") {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="mb-12">
      <h1 className="text-3xl font-bold mb-6">Your Notebooks</h1>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="New notebook title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <Button onClick={createNotebook}>Create</Button>
      </div>

      <div className="flex flex-wrap gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : notebooks.map((notebook) => (
            <Card key={notebook.id} className="group relative p-4 w-[250px] h-[150px]">
              <CardContent className="p-0 h-full">
                <div className="h-full flex flex-col justify-between items-start">
                  <button
                    onClick={() => {
                      setNavigatingTo(notebook.id);
                      router.push(`/editor/${notebook.id}`);
                    }}
                    className="text-left text-xl font-medium hover:underline disabled:opacity-60"
                    disabled={navigatingTo === notebook.id}
                  >
                    {navigatingTo === notebook.id ? (
                      <Spinner size="small" className="text-muted-foreground" />
                    ) : (
                      notebook.title
                    )}
                  </button>

                  <p className="text-sm text-gray-500 mt-2">
                    Created: {new Date(notebook.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedNotebookId(notebook.id);
                        setOpenDialog(true);
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteNotebook(notebook.id)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
      </div>

      <ShareNotebookDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        notebookId={selectedNotebookId}
      />
    </div>
  );
}
