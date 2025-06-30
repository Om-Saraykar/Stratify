"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/loader";
import { useDashboardLoading } from "@/lib/use-dashboard-loading";

interface ClientDashboardProps {
  session: Session;
  children: React.ReactNode;
}

export default function ClientDashboard({
  session,
  children,
}: ClientDashboardProps) {
  const pathname = usePathname();
  const section = pathname.split("/")[2] ?? "Dashboard";
  const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1);

  const { loading, setLoading } = useDashboardLoading();

  // Reset loading to false after page has changed
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

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
        <div className="flex flex-col h-full overflow-hidden">
          <div className="@container/main flex flex-col flex-grow">
            <div className="flex-grow flex flex-col p-4 md:p-6 lg:p-6 overflow-hidden">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Spinner size="large" />
                </div>
              ) : (
                children
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
