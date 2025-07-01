// src/app/dashboard/tasks/components/new-task-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import DateTimePicker from "@/components/journal/datetime-picker"
import { useTasks } from "@/hooks/use-tasks"

const priorities = ["LOW", "MEDIUM", "HIGH"]
const statuses = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE", "CANCELLED"]
const labels = ["PERSONAL", "WORK", "HEALTH", "STUDY", "OTHER"]
interface NewTaskDialogProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  onTaskCreated?: () => void
  taskId?: string
  initialData?: {
    title: string
    description: string
    status: string
    label: string
    priority: string
    startAt?: Date
    endAt?: Date
  }
}

export function NewTaskDialog({
  open,
  onOpenChange,
  onTaskCreated,
  taskId,
  initialData,
}: NewTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("TODO")
  const [label, setLabel] = useState("PERSONAL")
  const [priority, setPriority] = useState("MEDIUM")
  const [startAt, setStartAt] = useState<Date>(new Date())
  const [endAt, setEndAt] = useState<Date>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { refetchTasks } = useTasks();

  useEffect(() => {
    if (open && initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description)
      setStatus(initialData.status)
      setLabel(initialData.label)
      setPriority(initialData.priority)
      setStartAt(initialData.startAt ?? new Date())
      setEndAt(initialData.endAt ?? new Date())
    } else if (!open) {
      setTitle("")
      setDescription("")
      setStatus("TODO")
      setLabel("PERSONAL")
      setPriority("MEDIUM")
      setStartAt(new Date())
      setEndAt(new Date())
      setIsSubmitting(false)
    }
  }, [open, initialData])

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required.")
      return
    }

    try {
      setIsSubmitting(true)

      const url = taskId ? `/api/tasks/${taskId}` : "/api/tasks"
      const method = taskId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status,
          label,
          priority,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        console.error("Failed to save task:", error)
        alert("Something went wrong saving the task.")
        return
      }

      onTaskCreated?.()
      onOpenChange(false)
      refetchTasks()
    } catch (err) {
      console.error("Error saving task:", err)
      alert("Unexpected error saving task.")
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 p-6 pb-4">
          <DialogTitle>{taskId ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto px-6 py-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Label</Label>
              <Select value={label} onValueChange={setLabel}>
                <SelectTrigger>
                  <SelectValue placeholder="Label" />
                </SelectTrigger>
                <SelectContent>
                  {labels.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label>Start At</Label>
              <DateTimePicker value={startAt} onChange={setStartAt} />
            </div>
            <div className="space-y-2">
              <Label>End At</Label>
              <DateTimePicker value={endAt} onChange={setEndAt} />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 px-6 pb-6 flex-shrink-0">
          <Button type="button" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (taskId ? "Saving..." : "Creating...") : taskId ? "Save Changes" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
