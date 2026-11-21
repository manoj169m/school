"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Category } from "./schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { TableActionButtons } from "./data-table-row-actions";


export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "vehicleNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="vehicle Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("vehicleNumber")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    accessorKey: "driverName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="driver Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("driverName")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="contact No" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("contactNumber")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="capacity" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("capacity")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    accessorKey: "chassisNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="chassis No" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("chassisNo")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    accessorKey: "engineNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="engine No" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("engineNo")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    accessorKey: "modal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="modal" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("modal")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    accessorKey: "mielage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="mielage" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("mielage")}</span>
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
      <DataTableColumnHeader column={column} title="actions" />
    ),
    id: "actions",
    cell: ({ row }) => <TableActionButtons row={row} />,
  },
];