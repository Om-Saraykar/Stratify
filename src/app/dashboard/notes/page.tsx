"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Notebook = {
  id: string;
  title: string;
  content: any;
  createdAt: string;
};

export default function NotesPage() {
  return (
    <SessionProvider>
      <InsideNode/ >
    </SessionProvider>
  );
}

export function InsideNode() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [newTitle, setNewTitle] = useState("");

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch notebooks once session is ready
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchNotebooks = async () => {
      const res = await fetch(`/api/notebooks`);
      const data = await res.json();
      setNotebooks(data);
    };

    fetchNotebooks();
  }, [status]);

  const createNotebook = async () => {
    const res = await fetch("/api/notebooks", {
      method: "POST",
      body: JSON.stringify({
        title: newTitle || "Untitled",
        content: [],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const created = await res.json();
    setNotebooks([created, ...notebooks]);
    setNewTitle("");
  };

  const deleteNotebook = async (id: string) => {
    await fetch(`/api/notebooks/${id}`, {
      method: "DELETE",
    });
    setNotebooks(notebooks.filter((n) => n.id !== id));
  };

  if (status === "loading") {
    return <p className="p-6">Loading...</p>;
  }
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Notebooks</h1>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="New notebook title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <Button onClick={createNotebook}>Create</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notebooks.map((notebook) => (
          <Card key={notebook.id} className="group relative p-4">
            <CardContent className="p-0">
              <Link
                href={`/editor/${notebook.id}`}
                className="text-xl font-medium hover:underline"
              >
                {notebook.title}
              </Link>
              <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(notebook.createdAt).toLocaleDateString()}
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                onClick={() => deleteNotebook(notebook.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
