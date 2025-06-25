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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    if (isOpen) {
      setTitle(initialNote?.title || "")
      setDescription(initialNote?.description || "")
      setChecklist(initialNote?.checklist || [])

      if (initialNote?.image) {
        if (typeof initialNote.image === "string") {
          setImageUrl(initialNote.image)
          setImageFile(null)
        } else {
          setImageFile(initialNote.image)
          setImageUrl(null)
        }
      } else {
        setImageFile(null)
        setImageUrl(null)
      }

      setSelectedDate(initialNote?.date ? new Date(initialNote.date) : new Date())
    } else {
      // Reset when closed
      setTitle("")
      setDescription("")
      setChecklist([])
      setImageFile(null)
      setImageUrl(null)
      setSelectedDate(new Date())
    }
  }, [initialNote, isOpen])

  const handleSave = () => {
    const note = {
      ...initialNote,
      id: initialNote?.id, // Preserve ID for edits
      title,
      description,
      checklist,
      image: imageFile ? URL.createObjectURL(imageFile) : imageUrl ?? null,
      date: (selectedDate ?? new Date()).toISOString(), 
    }

    onSave(note)
    setIsOpen?.(false)
  }


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="default" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Entry
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 p-6 pb-4">
          <DialogTitle>{initialNote ? "Edit Entry" : "New Entry"}</DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto px-6 py-2 space-y-6">
          <DataBox
            title={title}
            description={description}
            checklist={checklist}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onChecklistChange={setChecklist}
          />

          <div>
            <h3 className="text-md font-semibold mb-2">Select Date</h3>
            <div className="flex justify-center">
              <DayPicker
                date={selectedDate}
                onDateSelect={(date) => setSelectedDate(date)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2">Add Image</h3>
            <ImageBox
              image={imageFile || imageUrl}
              onImageChange={(file) => {
                setImageFile(file)
                setImageUrl(null)
              }}
            />
          </div>
        </div>

        <DialogFooter className="pt-4 px-6 pb-6 flex-shrink-0">
          <Button type="button" onClick={handleSave}>
            {initialNote ? "Update Entry" : "Save Entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
