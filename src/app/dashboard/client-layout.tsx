"use client";

import { usePathname } from "next/navigation";
import { Session } from "next-auth";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface ClientDashboardProps {
  session: Session;
  children: React.ReactNode;
}

export default function ClientDashboard({ session, children }: ClientDashboardProps) {
  const pathname = usePathname();
  const section = pathname.split("/")[2] ?? "Dashboard"; // e.g., 'notes', 'tasks'

  const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1); // Capitalize

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" session={session} />

      <SidebarInset>
        <SiteHeader title={sectionTitle} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
