"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { TableActionButtons } from "./data-table-row-actions";
import { AccountInput } from "@/lib/validation/TableValidations";


export const columns: ColumnDef<AccountInput>[] = [
  {
    id: "serialNumber",
    header: "S.No",
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      const absoluteRowIndex = pageIndex * pageSize + row.index + 1;

      return (
        <div className="text-center font-medium ">
          {absoluteRowIndex}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
 
  {
    accessorKey: "accountName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Name" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("accountName")}</div>
    ),
  },
  {
    accessorKey: "accountType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Type" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("accountType")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-[200px]">{row.getValue("description") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "applicableFor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Type" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("applicableFor")}</div>
    ),
  },
  {
    accessorKey: "openingBalance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Opening Balance" />
    ),
    cell: ({ row }) => (
      <div className="">
        {new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(row.getValue("openingBalance"))}
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
