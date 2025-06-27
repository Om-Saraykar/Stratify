"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const priorities = ["LOW", "MEDIUM", "HIGH"]
const statuses = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE", "CANCELLED"]
const labels = ["PERSONAL", "WORK", "HEALTH", "STUDY", "OTHER"]

export function NewTaskDialog({
  open,
  onOpenChange,
  onTaskCreated,
}: {
  open: boolean
  onOpenChange: (value: boolean) => void
  onTaskCreated?: () => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("TODO")
  const [label, setLabel] = useState("PERSONAL")
  const [priority, setPriority] = useState("MEDIUM")
  const [startAt, setStartAt] = useState<Date | undefined>(undefined)
  const [endAt, setEndAt] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (!open) {
      setTitle("")
      setDescription("")
      setStatus("TODO")
      setLabel("PERSONAL")
      setPriority("MEDIUM")
      setStartAt(undefined)
      setEndAt(undefined)
    }
  }, [open])

  const handleSave = async () => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        status,
        label,
        priority,
        startAt: startAt?.toISOString(),
        endAt: endAt?.toISOString(),
      }),
    })

    if (res.ok) {
      onTaskCreated?.()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 p-6 pb-4">
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto px-6 py-2 space-y-6">
          <div className="space-y-2">
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    {startAt ? format(startAt, "PPP p") : "Pick start time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <DatePicker
                    selected={startAt}
                    onChange={(date) => setStartAt(date ?? undefined)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium">End</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    {endAt ? format(endAt, "PPP p") : "Pick end time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <DatePicker
                    selected={startAt}
                    onChange={(date) => setStartAt(date ?? undefined)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 px-6 pb-6 flex-shrink-0">
          <Button type="button" onClick={handleSave}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
