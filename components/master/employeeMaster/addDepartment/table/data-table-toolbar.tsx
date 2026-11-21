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
  SelectValue,
} from "@/components/ui/select";
import { DataTableViewOptions } from "./data-table-view-options";
import { ExportExcel } from "./ExcelExport";
import { useState } from "react";
import {
  DepartmentCreationFormValues,
  DepartmentSheetModal,
} from "../sheetModel/SheetModel";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDepartmentCreated = async (
    newDepartmentData: DepartmentCreationFormValues
  ) => {
    console.log("New Department Data:", newDepartmentData);
    // Perform additional logic if needed
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-2">
      {/* Left Section: Filters and Input */}
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Column Selection Dropdown */}
        <Select value={selectedColumn} onValueChange={setSelectedColumn}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Select Column" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All Columns
            </SelectItem>
            {filterableColumns.map((column) => (
              <SelectItem key={column.id} value={column.id} className="text-xs">
                {column.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Input */}
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
          className="h-8 w-[150px] lg:w-[250px] text-xs px-2 py-1"
        />

        {/* Export to Excel */}
        <ExportExcel table={table} />
      </div>

      {/* Right Section: Buttons */}
      <div className="flex items-center gap-4">
        <DataTableViewOptions table={table} />
        <Button
          onClick={handleOpenModal}
          className="h-8 bg-white shadow-md text-custom-red-600 font-semibold border border-custom-pink-300 hover:bg-custom-red-600 hover:text-white "
        >
          Add Department
        </Button>
        <DepartmentSheetModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onDepartmentCreated={handleDepartmentCreated}
        />
      </div>
    </div>
  );
}
