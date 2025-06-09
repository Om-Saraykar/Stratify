import { Outlet } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout() {
    return (
        <SidebarProvider>
            <div className="flex w-full h-screen">
                <AppSidebar />
                <main className="flex-grow p-6 overflow-auto bg-gray-100">
                    <SidebarTrigger />
                    <Outlet /> {/* Render nested route components here */}
                </main>
            </div>
        </SidebarProvider>
    );
}
