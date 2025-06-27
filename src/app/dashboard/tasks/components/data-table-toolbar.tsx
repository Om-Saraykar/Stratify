"use client"

import { useState } from "react"
import { Table } from "@tanstack/react-table"
import { Plus, X } from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { NewTaskDialog } from "./new-task-dialog" // create this

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  refetch?: () => void // optional if using SWR/React Query
}

export function DataTableToolbar<TData>({
  table,
  refetch,
}: DataTableToolbarProps<TData>) {
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
        <Button 
          variant="default"
          onClick={() => setShowNewTaskDialog(true)} 
          className="h-8"
        >
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      <NewTaskDialog
        open={showNewTaskDialog}
        onOpenChange={setShowNewTaskDialog}
        onTaskCreated={refetch}
      />
    </div>
  )
}
