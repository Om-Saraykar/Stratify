import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NewNoteDialog } from "./new-note-dialog"
import Image from "next/image"
import { useState } from "react"
import clsx from "clsx" // make sure to install clsx if you haven't: `npm install clsx`

interface ChecklistItem {
  id?: string
  text: string
  checked: boolean
}

interface JournalEntryProps {
  title: string
  description?: string
  image?: string
  checklist?: ChecklistItem[]
  date: string
  stressScore?: number
  onEdit?: (updatedEntry: Partial<JournalEntryProps>) => void
  onDelete?: () => void
}

export function NoteCard({
  title,
  description,
  image,
  checklist = [],
  date,
  stressScore,
  onEdit,
  onDelete,
}: JournalEntryProps) {
  const [editOpen, setEditOpen] = useState(false)

  const formatDate = (dateString: string) => {
    try {
      const dateObj = new Date(dateString)
      const day = dateObj.getDate()
      const month = dateObj.toLocaleString("default", { month: "short" })
      const year = dateObj.getFullYear()
      return { day, month, year }
    } catch {
      return { day: "?", month: "?", year: "???" }
    }
  }

  const { day, month, year } = formatDate(date)

  const getScoreColor = (score: number) => {
    if (score <= 2) return "text-green-600"
    if (score <= 5) return "text-yellow-600"
    if (score <= 7) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <>
      <div className="bg-white rounded-xl border shadow-sm p-4 flex flex-col relative group hover:shadow-md transition">
        {/* Header with date and dropdown */}
        <div className="flex justify-between items-start w-full mb-4">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 text-gray-800 w-20 h-20 flex-shrink-0 border border-gray-200 shadow-sm">
            <span className="text-3xl font-bold">{day}</span>
            <span className="text-sm font-medium uppercase mt-1">{month}</span>
            <span className="text-xs text-gray-600">{year}</span>
          </div>

          {(onEdit || onDelete) && (
            <div className="opacity-0 group-hover:opacity-100 transition z-10 p-2 -mr-2 -mt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" aria-label="Open entry menu" className="p-1 rounded-full hover:bg-gray-100">
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-28">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => setEditOpen(true)} className="flex items-center gap-2">
                      <Pencil className="w-4 h-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem onClick={onDelete} className="text-red-500 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <hr className="border-t border-gray-200 mb-4" />

        {/* Optional image */}
        {image && (
          <div className="rounded-md overflow-hidden h-40 w-full mb-3">
            <Image
              src={image}
              alt="Entry image"
              width={400}
              height={160}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Title and description */}
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-2 overflow-hidden text-ellipsis">
            {description}
          </p>
        )}

        {/* Stress Score */}
        {typeof stressScore === "number" && (
          <p className={clsx("text-sm font-medium mb-2", getScoreColor(stressScore))}>
            Stress Score: {stressScore}/10
          </p>
        )}

        {/* Checklist */}
        {Array.isArray(checklist) && checklist.length > 0 && (
          <div className="flex flex-col gap-1 pt-2">
            {checklist.map((item) => (
              <label key={item.id ?? item.text} className="flex items-start gap-2 text-sm">
                <Checkbox checked={item.checked} className="mt-0.5" disabled />
                <span className={item.checked ? "line-through text-muted-foreground" : ""}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {onEdit && (
        <NewNoteDialog
          onSave={(entry) => {
            setEditOpen(false)
            onEdit(entry)
          }}
          initialNote={{ title, description, checklist, image, date }}
          trigger={<span className="hidden" />}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </>
  )
}
