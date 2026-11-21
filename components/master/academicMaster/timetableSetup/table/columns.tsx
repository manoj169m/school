"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { TableActionButtons } from "./data-table-row-actions";
import { ClassInput } from "@/lib/validation/TableValidations";





export const columns: ColumnDef<ClassInput>[] = [
  {
    id: "serialNumber",
    header: "S.No",
    cell: ({ row, table }) => {
      // Calculate the absolute index of the row across pages
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      const absoluteRowIndex = pageIndex * pageSize + row.index + 1;
      
      return (
        <div className="text-center font-medium">
          {absoluteRowIndex}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class" />

    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize">{row.getValue("name")}</div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "acronym",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acronym" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("acronym")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "displayOrder",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Display Order" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
        
          <span className="capitalize"> {row.getValue("displayOrder")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TableActionButtons row={row} />,
  },
];