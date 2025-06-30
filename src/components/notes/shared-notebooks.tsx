"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/loader";
import { SkeletonCard } from "@/components/notes/shared-notebooks-skeleton";

type SharedNotebook = {
  id: string;
  title: string;
  createdAt: string;
  ownerEmail: string;
  access: "VIEW" | "EDIT";
};

export default function SharedNotebooks() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [sharedNotebooks, setSharedNotebooks] = useState<SharedNotebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchShared = async () => {
      try {
        const res = await fetch("/api/shared-notebooks");
        const data = await res.json();
        setSharedNotebooks(data);
      } catch (error) {
        console.error("Failed to fetch shared notebooks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShared();
  }, [status]);

  if (status === "loading") return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Shared With You</h2>

      {loading ? (
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : sharedNotebooks.length === 0 ? (
        <p className="text-gray-500">No shared notebooks</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {sharedNotebooks.map((notebook) => (
            <Card key={notebook.id} className="p-4 w-[250px] h-[150px]">
              <CardContent className="p-0 h-full">
                <div className="h-full flex flex-col justify-between items-start">
                  <button
                    onClick={() => {
                      setNavigatingTo(notebook.id);
                      router.push(`/editor/${notebook.id}`);
                    }}
                    disabled={navigatingTo === notebook.id}
                    className="text-left text-xl font-medium hover:underline disabled:opacity-60"
                  >
                    {navigatingTo === notebook.id ? (
                      <Spinner size="small" className="text-muted-foreground" />
                    ) : (
                      notebook.title
                    )}
                  </button>

                  <div className="text-sm text-gray-500 space-y-1 mt-2">
                    <p>Shared by: {notebook.ownerEmail}</p>
                    <p>Access: {notebook.access}</p>
                    <p>
                      Created:{" "}
                      {new Date(notebook.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
