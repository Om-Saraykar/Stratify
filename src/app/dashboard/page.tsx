// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";

export default function DashboardHome() {
  redirect("/dashboard/notes");
}
