import { Outlet } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeSwitch } from "@/components/theme-switch";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen">
        <AppSidebar />

        <div className="flex flex-col flex-1">
          <div className="p-2 bg-background border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <SidebarTrigger />
            <ThemeSwitch />
          </div>
          <div className="flex justify-center w-full h-screen overflow-y-auto mb-10">
              <Outlet />
          </div>
        </div>
      </div>  
    </SidebarProvider>
  );
}