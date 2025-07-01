// src/app/dashboard/tasks/components/column.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { labels, priorities, statuses } from "../data/data"

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => <span className="font-medium">{row.getValue("title")}</span>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => <div className="text-sm text-muted-foreground truncate max-w-[400px]">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Label" />
    ),
    cell: ({ row }) => {
      const label = labels.find((l) => l.value === row.getValue("label"))
      return label ? <Badge variant="outline">{label.label}</Badge> : null
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find((s) => s.value === row.getValue("status"))
      return status ? (
        <div className="flex items-center gap-2">
          {status.icon && <status.icon className="h-4 w-4 text-muted-foreground" />}
          <span>{status.label}</span>
        </div>
      ) : null
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find((p) => p.value === row.getValue("priority"))
      return priority ? (
        <div className="flex items-center gap-2">
          {priority.icon && <priority.icon className="h-4 w-4 text-muted-foreground" />}
          <span>{priority.label}</span>
        </div>
      ) : null
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "startAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("startAt") as string | Date | null
      return value ? new Date(value).toLocaleDateString() : "-"
    },
  },
  {
    accessorKey: "endAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("endAt") as string | Date | null
      return value ? new Date(value).toLocaleDateString() : "-"
    },
  },  
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
