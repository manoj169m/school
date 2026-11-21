"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  FileSpreadsheet, 
  Filter, 
  MoreHorizontal 
} from "lucide-react";
import { DataTableViewOptions } from "./data-table-view-options";

interface FeeByClassToolbarProps<TData> {
  table: Table<TData>;
  onAddNew?: () => void;
  onImport?: () => void;
}

export function FeeByClassToolbar<TData>({
  table, 
  onImport
}: FeeByClassToolbarProps<TData>) {
  const [selectedColumn, setSelectedColumn] = React.useState<string>("all");

  // Get filterable columns
  const filterableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" &&
        column.getCanFilter() &&
        column.id !== "select" &&
        column.id !== "actions"
    );

  // Handle filtering
  const handleFilter = (value: string) => {
    if (selectedColumn === "all") {
      filterableColumns.forEach((column) => {
        column.setFilterValue(value);
      });
    } else {
      const column = table.getColumn(selectedColumn);
      column?.setFilterValue(value);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-2">
      {/* Filters and Search Section */}
      <div className="flex flex-col md:flex-row w-full items-start md:items-center gap-2">
        {/* Column Filter Dropdown */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
          <Select value={selectedColumn} onValueChange={setSelectedColumn}>
            <SelectTrigger className="w-full md:w-[140px] h-9 text-xs">
              <SelectValue placeholder="Filter Column" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Columns
              </SelectItem>
              {filterableColumns.map((column) => (
                <SelectItem 
                  key={column.id} 
                  value={column.id} 
                  className="text-xs"
                >
                  {column.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Input */}
          <div className="relative w-full md:w-auto">
            <Filter className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Filter ${
                selectedColumn === "all" ? "all columns" : selectedColumn
              }...`}
              value={
                selectedColumn === "all"
                  ? ""
                  : (table.getColumn(selectedColumn)?.getFilterValue() as string) ??
                    ""
              }
              onChange={(event) => handleFilter(event.target.value)}
              className="h-9 w-full md:w-[200px] pl-8 text-xs"
            />
          </div>
        </div>

        {/* Additional Actions Dropdown */}
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onImport}
                className="cursor-pointer"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Import Fees
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add New Fee Button */}
<DataTableViewOptions table={table}/>
        </div>
      </div>
    </div>
  );
}