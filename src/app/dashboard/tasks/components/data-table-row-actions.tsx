"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { taskSchema } from "../data/schema"
import { NewTaskDialog } from "./new-task-dialog"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)

  const [editOpen, setEditOpen] = useState(false)

  const router = useRouter()

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error()

      toast.success("Task deleted")
      router.push("/dashboard/tasks")
      router.refresh()
    } catch {
      toast.error("Failed to delete task")
    }
  }


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NewTaskDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        taskId={task.id}
        initialData={task}
        onTaskCreated={() => {
          router.push("/dashboard/tasks")
          router.refresh()
        }}
      />
    </>
  )
}
