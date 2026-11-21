"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { TableActionButtons } from "./data-table-row-actions";
import { ConcessionCategoryInput } from "@/lib/validation/TableValidations";

export const columns: ColumnDef<ConcessionCategoryInput>[] = [
  {
    id: "serialNumber",
    header: "S.No",
    cell: ({ row, table }) => {
      // Calculate the absolute index of the row across pages
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      const absoluteRowIndex = pageIndex * pageSize + row.index + 1;

      return <div className="text-center font-medium">{absoluteRowIndex}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{row.getValue("name")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      // Ensure filterFn always returns a boolean (true/false)
      const rowValue = row.getValue(id)?.toString().toLowerCase() || "";
      return rowValue.includes(value.toLowerCase());
    },
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[200px] items-center">
          <span>{row.getValue("description") || "N/A"}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      // Ensure filterFn always returns a boolean (true/false)
      const rowValue = row.getValue(id)?.toString().toLowerCase() || "";
      return rowValue.includes(value.toLowerCase());
    },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    id: "actions",
    cell: ({ row }) => <TableActionButtons row={row} />,
  },
];
