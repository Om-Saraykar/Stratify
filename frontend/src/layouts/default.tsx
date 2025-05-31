import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex flex-col items-center justify-center py-6 text-sm text-default-500 gap-2">
        <p className="text-center">
          © {new Date().getFullYear()} Stratify. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
