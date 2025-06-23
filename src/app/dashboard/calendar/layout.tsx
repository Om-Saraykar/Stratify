import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/app/event-calendar/components/ui/sonner";
import { ThemeProvider } from "@/app/event-calendar/providers/theme-provider";
import { CalendarProvider } from "@/app/event-calendar/components/event-calendar/calendar-context";
// import "./event-calendar.css";

const fontSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CalendarProvider>{children}</CalendarProvider>
      <Toaster />
    </ThemeProvider>
  );
}
