import { AppSidebar } from "@/app/event-calendar/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/app/event-calendar/components/ui/sidebar";
import BigCalendar from "@/app/event-calendar/components/big-calendar";
import { CalendarProvider } from "@/app/event-calendar/components/event-calendar/calendar-context";

export default function CalendarView() {
  return (
    <CalendarProvider>
      <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
        <BigCalendar />
      </div>
    </CalendarProvider>
  )
}
