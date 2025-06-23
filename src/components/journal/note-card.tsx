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

interface NoteCardProps {
  title: string
  description?: string
  image?: string
  checklist?: { id: string; text: string; checked: boolean }[]
  date: string;
  onEdit?: (note: any) => void
  onDelete?: () => void
}

export function NoteCard({
  title,
  description,
  image,
  checklist = [],
  date,
  onEdit,
  onDelete,
}: NoteCardProps) {
  const [editOpen, setEditOpen] = useState(false)

  // Function to format the date - now without time
  const formatDate = (dateString: string) => {
    try {
      const dateObj = new Date(dateString);
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString('default', { month: 'short' }); // e.g., "Jun"
      const year = dateObj.getFullYear();
      return { day, month, year: year.toString() }; // Return object for individual styling
    } catch (error) {
      console.error("Error formatting date:", error);
      return { day: '?', month: '?', year: '????' }; // Fallback
    }
  };

  const { day, month, year } = formatDate(date); // Destructure formatted date

  return (
    <>
      <div className="bg-white rounded-xl border shadow-sm p-4 flex flex-col relative group hover:shadow-md transition">
        {/* Date and Dropdown Menu in a sophisticated top section */}
        <div className="flex justify-between items-start w-full mb-4">
          {/* Date Block: Shadcn Default Styling */}
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50 text-gray-800 w-20 h-20 flex-shrink-0 border border-gray-200 shadow-sm">
            <span className="text-3xl font-bold leading-none">{day}</span>
            <span className="text-sm font-medium uppercase mt-1">{month}</span>
            <span className="text-xs text-gray-600">{year}</span>
          </div>

          {/* Top right menu icon with dropdown */}
          {(onEdit || onDelete) && (
            <div className="opacity-0 group-hover:opacity-100 transition z-10 p-2 -mr-2 -mt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" aria-label="Open note menu" className="p-1 rounded-full hover:bg-gray-100">
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

        {/* Horizontal Line after date block */}
        <hr className="border-t border-gray-200 mb-4" />

        {/* Image */}
        {image && (
          <div className="rounded-md overflow-hidden h-40 w-full mb-3">
            <Image
              src={image}
              alt="Note image"
              width={400}
              height={160}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold leading-tight mb-2">{title}</h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
            {description}
          </p>
        )}

        {/* Checklist */}
        {checklist.length > 0 && (
          <div className="flex flex-col gap-1 pb-1 pt-2"> {/* Removed border-t and border-gray-100 */}
            {checklist.map((item) => (
              <label key={item.id} className="flex items-start gap-2 text-sm">
                <Checkbox checked={item.checked} className="mt-0.5" />
                <span
                  className={
                    item.checked ? "line-through text-muted-foreground" : ""
                  }
                >
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
          onSave={(note) => {
            setEditOpen(false)
            onEdit(note)
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