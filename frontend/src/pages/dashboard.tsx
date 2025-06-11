import { Outlet } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeSwitch } from "@/components/theme-switch"

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen">
        <AppSidebar />
        <main className="flex-grow flex-col py-6 px-4 overflow-auto bg-background">
          <div className="flex justify-between">
            <SidebarTrigger />
            <ThemeSwitch />
          </div>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
