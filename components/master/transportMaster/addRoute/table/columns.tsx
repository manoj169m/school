"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Route } from "./schema"; // Assuming 'Route' is the updated schema
import { DataTableColumnHeader } from "./data-table-column-header";
import { TableActionButtons } from "./data-table-row-actions";

export const columns: ColumnDef<Route>[] = [
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
    accessorKey: "routeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Route Name" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[150px] items-center">
        <span className="capitalize">{row.getValue("routeName")}</span>
      </div>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: true,
  },
  {
    accessorKey: "numberOfStops",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No. of Stops" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("numberOfStops")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "vehicle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vehicle No" />
    ),
    cell: ({ row }) => {
      // Cast the row value to the correct type (Vehicle type)
      const vehicle = row.getValue("vehicle") as { vehicleNumber: string; regNo: string };
      return (
        <div className="text-center">
          {vehicle ? `${vehicle.vehicleNumber} - ${vehicle.regNo}` : "N/A"}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "stops",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="font-semibold text-md" title="Stops" />
    ),
    cell: ({ row }) => {
      // Cast the row value to the correct type (Stop[] type)
      const stops = row.getValue("stops") as { stopNumber: number; stopName: string }[];
      return (
        <div className="text-left">
          {stops?.map((stop, index) => (
            <div key={index} className="flex items-center">
              <span className="font-medium">{`Stop ${stop.stopNumber}: `}</span>
              <span>{stop.stopName}</span>
            </div>
          ))}
        </div>
      );
    },
    enableSorting: false, // You may disable sorting for this column as it contains non-scalar data
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    id: "actions",
    cell: ({ row }) => <TableActionButtons row={row} />,
  },
];
