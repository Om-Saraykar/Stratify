import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search, StickyNote, Archive, Tag } from "lucide-react"

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return (
      <main className="flex-1 px-6 py-1 overflow-y-auto">
        {children}
      </main>
  )
}

function SidebarLink({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
      {icon}
      {label}
    </div>
  )
}
