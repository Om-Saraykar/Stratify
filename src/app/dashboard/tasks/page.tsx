// src/components/views/tasks/page.tsx
"use client"

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { useTasks } from "@/hooks/use-tasks"
import { NewTaskDialog } from "@/app/dashboard/tasks/components/new-task-dialog"
import { useState } from "react"

export default function Tasks() {
  const { tasks, refetchTasks } = useTasks()
  const [open, setOpen] = useState(false)

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here&apos;s a list of your tasks for this month!
        </p>
      </div>

      <DataTable data={Array.isArray(tasks) ? tasks : []} columns={columns} />

      <NewTaskDialog
        open={open}
        onOpenChange={setOpen}
        onTaskCreated={refetchTasks}
      />
    </div>
  )
}

// app/dashboard/tasks/page.tsx
export const dynamic = "force-dynamic"
