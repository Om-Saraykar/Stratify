"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState, useEffect } from "react"

import { DataBox } from "@/components/journal/data-box"
import { ImageBox } from "@/components/journal/image-box"
import DayPicker from "@/components/journal/day-picker"

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

interface NewNoteDialogProps {
  onSave: (note: any) => void
  initialNote?: any
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function NewNoteDialog({
  onSave,
  initialNote,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: NewNoteDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = controlledOpen !== undefined ? setControlledOpen : setInternalOpen

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [image, setImage] = useState<File | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    if (isOpen) {
      setTitle(initialNote?.title || "")
      setDescription(initialNote?.description || "")
      setChecklist(initialNote?.checklist || [])
      if (typeof initialNote?.image === "string") {
        setImage(null)
      } else {
        setImage(initialNote?.image || null);
      }
      if (initialNote?.date) {
        setSelectedDate(new Date(initialNote.date));
      } else {
        setSelectedDate(new Date());
      }
    } else {
      setTitle("");
      setDescription("");
      setChecklist([]);
      setImage(null);
      setSelectedDate(new Date());
    }
  }, [initialNote, isOpen])

  function handleSave() {
    const note = {
      ...initialNote,
      title,
      description,
      checklist,
      image: image
        ? URL.createObjectURL(image)
        : initialNote?.image ?? null,
      date: selectedDate?.toISOString() || new Date().toISOString(),
    }

    onSave(note)
    if (setIsOpen) {
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="default" className="gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Add Entry
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-xl h-[80vh] flex flex-col p-0"> {/* Adjusted padding to 0 here */}
        <DialogHeader className="flex-shrink-0 p-6 pb-4"> {/* Added back padding for header */}
          <DialogTitle>{initialNote ? "Edit Entry" : "New Entry"}</DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto px-6 py-2 space-y-6"> {/* Adjusted padding and spacing */}
          {/* Title, description, checklist */}
          <DataBox
            title={title}
            description={description}
            checklist={checklist}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onChecklistChange={setChecklist}
          />

          {/* Date Picker */}
          <div>
            <h3 className="text-md font-semibold mb-2">Select Date</h3>
            <div className="flex justify-center"> {/* Centered DayPicker */}
              <DayPicker
                date={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
          </div>

          {/* Image upload (moved to last) */}
          <div>
            <h3 className="text-md font-semibold mb-2">Add Image</h3> {/* Added a heading for clarity */}
            <ImageBox image={image} onImageChange={setImage} />
          </div>
        </div>

        <DialogFooter className="pt-4 px-6 pb-6 flex-shrink-0"> {/* Adjusted padding for footer */}
          <Button type="button" onClick={handleSave}>
            {initialNote ? "Update Note" : "Save Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}