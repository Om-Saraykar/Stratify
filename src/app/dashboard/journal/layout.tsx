import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search, StickyNote, Archive, Tag } from "lucide-react"

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col gap-4">
        <Button className="w-full font-semibold" variant="default">
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>

        <nav className="flex flex-col gap-2">
          <SidebarLink icon={<StickyNote className="w-4 h-4" />} label="Notes" />
          <SidebarLink icon={<Archive className="w-4 h-4" />} label="Archive" />
          <SidebarLink icon={<Tag className="w-4 h-4" />} label="Edit Labels" />
        </nav>

        <div className="pt-4">
          <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Labels</h4>
          <div className="flex flex-col gap-2">
            {[
              { label: "Family", color: "bg-pink-500" },
              { label: "Tasks", color: "bg-purple-500" },
              { label: "Personal", color: "bg-green-500" },
              { label: "Meetings", color: "bg-cyan-500" },
              { label: "Shopping", color: "bg-teal-500" },
              { label: "Planning", color: "bg-orange-500" },
              { label: "Travel", color: "bg-blue-500" },
            ].map((tag) => (
              <div key={tag.label} className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${tag.color}`} />
                {tag.label}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <Input
            type="search"
            placeholder="Search notes"
            className="max-w-sm"
          />
        </div>

        {children}
      </main>
    </div>
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
