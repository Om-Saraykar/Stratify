"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";

type SharedNotebook = {
  id: string;
  title: string;
  createdAt: string;
  ownerEmail: string;
  access: "VIEW" | "EDIT";
};

export default function SharedNotebooks() {
  const { data: session, status } = useSession();
  const [sharedNotebooks, setSharedNotebooks] = useState<SharedNotebook[]>([]);
  const [loaded, setLoaded] = useState(false); // to avoid flashing "no shared notebooks" before fetch completes

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchShared = async () => {
      const res = await fetch("/api/shared-notebooks");
      const data = await res.json();
      setSharedNotebooks(data);
      setLoaded(true);
    };

    fetchShared();
  }, [status]);

  if (status === "loading") return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Shared With You</h2>

      {loaded && sharedNotebooks.length === 0 ? (
        <p className="text-gray-500">No shared notebooks</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sharedNotebooks.map((notebook) => (
            <Card key={notebook.id} className="p-4">
              <CardContent className="p-0">
                <Link
                  href={`/editor/${notebook.id}`}
                  className="text-xl font-medium hover:underline"
                >
                  {notebook.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  Shared by: {notebook.ownerEmail}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Access: {notebook.access}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(notebook.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
