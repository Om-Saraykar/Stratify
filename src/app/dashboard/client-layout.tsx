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
        {/*
          Removed flex-1 and flex-col from the direct child of SiteHeader.
          Instead, we'll make the content area specifically manage its height.
          Added `h-full` to ensure it takes the full height of `SidebarInset` after header.
        */}
        <div className="flex flex-col h-full overflow-hidden"> {/* Added overflow-hidden */}
          <div className="@container/main flex flex-col flex-grow"> {/* Use flex-grow here */}
            {/*
              Adjusted padding here. The `Chat` component now handles its own internal padding.
              This div will expand to fill the available space and contain the children.
            */}
            <div className="flex-grow flex flex-col p-4 md:p-6 lg:p-6 overflow-hidden"> {/* Added p-4/p-6 and overflow-hidden */}
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}