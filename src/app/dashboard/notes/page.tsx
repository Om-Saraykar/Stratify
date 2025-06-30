"use client"

import YourNotebooks from "@/components/notes/your-notebooks";
import SharedNotebooks from "@/components/notes/shared-notebooks";
import { SessionProvider } from "next-auth/react";

export default function Page() {
  return (
    <SessionProvider>
      <div className="p-6 max-w-4xl mx-auto">
        <YourNotebooks />
        <SharedNotebooks />
      </div>
    </SessionProvider>
  );  
}