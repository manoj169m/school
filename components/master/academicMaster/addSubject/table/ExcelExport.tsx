"use client";

import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Utility function to export table to CSV
export function exportTableToCSV<TData>(
  table: Table<TData>, 
  options?: {
    filename?: string;
    excludeColumns?: string[];
  }
) {
  const {
    filename = "exported_data",
    excludeColumns = []
  } = options || {};

  // Get visible columns that are not in excludeColumns
  const columns = table.getAllColumns()
    .filter(column => 
      column.getIsVisible() && 
      !excludeColumns.includes(column.id)
    );

  // Prepare header
  const headers = columns.map(column => 
    column.columnDef.header?.toString() || column.id
  );

  // Prepare rows
  const rows = table.getRowModel().rows.map(row => 
    columns.map(column => {
      const cellValue = row.getValue(column.id);
      // Convert cell value to string, handling potential null/undefined
      return cellValue !== undefined && cellValue !== null 
        ? String(cellValue).replace(/"/g, '""') 
        : '';
    })
  );

  //Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export Excel Component
interface ExportExcelProps<TData> {
  table: Table<TData>;
}

export function ExportExcel<TData>({ 
  table 
}: ExportExcelProps<TData>) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "exported_data",
            excludeColumns: ["select", "actions"],
          })
        }
        className="ml-auto  h-8 lg:flex bg-white shadow-md text-custom-red-600 font-semibold border border-custom-pink-300 hover:bg-custom-red-600 hover:text-white "
      >
        <Download className="size-4" aria-hidden="true" />
        Export
      </Button>
         
    </div>
  );
}