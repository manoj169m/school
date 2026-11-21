"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  // State to track the selected column for filtering
  const [selectedColumn, setSelectedColumn] = React.useState<string>("all")

  // Get filterable columns
  const filterableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && 
        column.getCanFilter() &&
        column.id !== "select" &&
        column.id !== "actions"
    )

  // Handle global filtering
  const handleFilter = (value: string) => {
    if (selectedColumn === "all") {
      // Apply filter to all columns
      filterableColumns.forEach((column) => {
        column.setFilterValue(value)
      })
    } else {
      // Apply filter to selected column
      const column = table.getColumn(selectedColumn)
      column?.setFilterValue(value)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Column Selection Dropdown */}
        <Select 
          value={selectedColumn} 
          onValueChange={setSelectedColumn}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Column" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Columns</SelectItem>
            {filterableColumns.map((column) => (
              <SelectItem key={column.id} value={column.id}>
                {column.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Input */}
        <Input
          placeholder={`Filter ${selectedColumn === 'all' ? 'all columns' : selectedColumn}...`}
          value={(
            selectedColumn === 'all' 
              ? '' 
              : (table.getColumn(selectedColumn)?.getFilterValue() as string)
          ) ?? ""}
          onChange={(event) => handleFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* View Options and Export Buttons */}
        <DataTableViewOptions table={table} />
        
      </div>
    </div>
  )
}