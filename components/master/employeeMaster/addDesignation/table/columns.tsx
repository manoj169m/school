"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Designation } from "./schema"; // Assuming 'Designation' is the updated schema
import { DataTableColumnHeader } from "./data-table-column-header";
import { TableActionButtons } from "./data-table-row-actions";

export const columns: ColumnDef<Designation>[] = [
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
    accessorKey: "title", // Changed to 'title' field for Designation
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" /> // Updated title
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("title")}</span>{" "}
          {/* Updated to 'title' */}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions " />
    ),
    id: "actions",
    cell: ({ row }) => <TableActionButtons row={row} />,
  },
];
