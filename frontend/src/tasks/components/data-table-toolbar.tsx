"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { priorities, statuses } from "../data/data"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"

import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"
import { DataTableViewOptions } from "@/tasks/components/data-table-view-options"


interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex mb-4">
      <div className="flex justify-start gap-2">
        <Input
          className="h-8 w-[150px] lg:w-[250px]"
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            options={statuses}
            title="Status"
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            options={priorities}
            title="Priority"
          />
        )}
        {isFiltered && (
          <Button
            className="h-8 px-2 lg:px-3"
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
      <Button
        className="ml-auto"
        size="sm"
        variant="default"
      >
        Add Tasks
      </Button>
    </div>
  )
}
