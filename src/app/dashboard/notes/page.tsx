"use client"

import YourNotebooks from "@/components/notes/your-notebooks";
import SharedNotebooks from "@/components/notes/shared-notebooks";
import { SessionProvider } from "next-auth/react";

export default function Page() {
  return (
    <SessionProvider>
      <div className="w-4xl mx-auto h-full p-6">
        <YourNotebooks />
        <SharedNotebooks />
      </div>
    </SessionProvider>
  );  
}