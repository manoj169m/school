"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { TableActionButtons } from "./data-table-row-actions";
import { ColumnEventFormValues } from "@/lib/validation/TableValidations";

export const columns: ColumnDef<ColumnEventFormValues>[] = [
  {
    id: "serialNumber",
    header: "S.No",
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      const absoluteRowIndex = pageIndex * pageSize + row.index + 1;

      return <div className="text-center font-medium">{absoluteRowIndex}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "branchId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[150px] items-center">
        <span className="capitalize">{row.original.branch.acronym}</span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event Type" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[150px] items-center">
        <span className="capitalize">{row.getValue("type")}</span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "eventName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event Name" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[150px] items-center">
        <span className="capitalize">{row.getValue("eventName")}</span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "locationName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location Name" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[150px] items-center">
        <span className="capitalize">{row.getValue("locationName")}</span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date")).toLocaleDateString();
      return <div className="flex w-[120px] items-center">{date}</div>;
    },
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Time" />
    ),
    cell: ({ row }) => {
      const startTime = new Date(row.getValue("startTime")).toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
      return <div className="flex w-[100px] items-center">{startTime}</div>;
    },
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Time" />
    ),
    cell: ({ row }) => {
      const endTime = new Date(row.getValue("endTime")).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return <div className="flex w-[100px] items-center">{endTime}</div>;
    },
  },

  {
    accessorKey: "organizerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Organizer Name" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[150px] items-center">
        <span className="capitalize">{row.getValue("organizerName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[200px] items-center">
        <span>{row.getValue("description")}</span>
      </div>
    ),
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    id: "actions",
    cell: ({ row }) => <TableActionButtons row={row} />,
  },
];
