"use client"

import * as React from "react"
import {
  IconNotes,
  IconChecklist,
  IconCalendar,
  IconNotebook,
  IconSearch,
  IconSettings,
  IconSparkles,
  IconBulb,
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Import Session and User types from next-auth
import { Session } from "next-auth"; // You might need to import Session directly
// Or if you want just the User type:
// import { User as NextAuthUser } from "next-auth";


interface AppSidebarCustomProps {
  activeItem: string;
  onSelect: (item: string) => void;
  session: Session | null; // <--- Add session prop here, it can be null if not logged in
}

type AppSidebarProps = AppSidebarCustomProps &
  Omit<React.ComponentProps<typeof Sidebar>, "onSelect">

const navMain = [
  { title: "Notes", icon: IconNotes },
  { title: "Tasks", icon: IconChecklist },
  { title: "Journaling", icon: IconNotebook },
  { title: "Calendar", icon: IconCalendar },
]

const navSecondary = [
  { title: "Search", icon: IconSearch },
  { title: "AI Chat", icon: IconSparkles },
  { title: "Insights", icon: IconBulb },
  { title: "Settings", icon: IconSettings },
]

export function AppSidebar({ activeItem, onSelect, session, ...props }: AppSidebarProps) {
  // Extract user data from session, providing fallbacks
  const user = session?.user;
  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "guest@example.com";
  // NextAuth's `image` property in Session.user typically holds the avatar URL
  const userAvatar = user?.image || "/avatars/default.jpg"; // Provide a default local avatar path

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Stratify</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => onSelect(item.title)}
                data-active={activeItem === item.title}
                className={
                  activeItem === item.title
                    ? "bg-muted text-primary"
                    : "hover:bg-muted/50"
                }
              >
                <item.icon className="size-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarMenu className="mt-6 border-t pt-4">
          {navSecondary.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => onSelect(item.title)}
                data-active={activeItem === item.title}
                className={
                  activeItem === item.title
                    ? "bg-muted text-primary"
                    : "hover:bg-muted/50"
                }
              >
                <item.icon className="size-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: userName, // <--- Pass dynamic name
            email: userEmail, // <--- Pass dynamic email
            avatar: userAvatar, // <--- Pass dynamic avatar
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}