"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { TableActionButtons } from "./data-table-row-actions";

// Define interface based on API response
interface HostelFeeData {
 id: number;
 hostelId: number;
 academicYearId: number;
 accountId: number;
 hostelName: string;
 academicYear: string;
 accountName: string;
 feeAmount: number;
 term: number;
 createdAt: string;
 updatedAt: string;
}

export const columns: ColumnDef<HostelFeeData>[] = [
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
   accessorKey: "academicYear",
   header: ({ column }) => (
     <DataTableColumnHeader column={column} title="Academic Year" />
   ),
   cell: ({ row }) => {
     return (
       <div className="flex w-[100px] items-center">
         <span className="capitalize">{row.getValue("academicYear")}</span>
       </div>
     );
   },
   filterFn: (row, id, value) => {
     return value.includes(row.getValue(id));
   },
 },
 {
   accessorKey: "hostelName",
   header: ({ column }) => (
     <DataTableColumnHeader column={column} title="Hostel Name" />
   ),
   cell: ({ row }) => {
     return (
       <div className="flex w-[100px] items-center">
         <span className="capitalize">{row.getValue("hostelName")}</span>
       </div>
     );
   },
   filterFn: (row, id, value) => {
     return value.includes(row.getValue(id));
   },
 },
 {
   accessorKey: "accountName",
   header: ({ column }) => (
     <DataTableColumnHeader column={column} title="Account Name" />
   ),
   cell: ({ row }) => {
     return (
       <div className="flex w-[100px] items-center">
         <span className="capitalize">{row.getValue("accountName")}</span>
       </div>
     );
   },
   filterFn: (row, id, value) => {
     return value.includes(row.getValue(id));
   },
 },
 {
   accessorKey: "term",
   header: ({ column }) => (
     <DataTableColumnHeader column={column} title="Term" />
   ),
   cell: ({ row }) => {
     return (
       <div className="flex w-[100px] items-center">
         <span className="capitalize">Term {row.getValue("term")}</span>
       </div>
     );
   },
   filterFn: (row, id, value) => {
     return value.includes(row.getValue(id));
   },
 },
 {
   accessorKey: "feeAmount",
   header: ({ column }) => (
     <DataTableColumnHeader column={column} title="Amount" />
   ),
   cell: ({ row }) => {
     const amount = row.getValue("feeAmount");
     return (
       <div className="flex w-[100px] items-center">
         <span>₹ {amount ? Number(amount).toLocaleString('en-IN', {
           minimumFractionDigits: 0,
           maximumFractionDigits: 2
         } as Intl.NumberFormatOptions) : '0'}</span>
       </div>
     );
   },
   filterFn: (row, id, value) => {
     return value.includes(row.getValue(id));
   },
 },
 {
   id: "actions",
   header: ({ column }) => (
     <DataTableColumnHeader column={column} title="Actions" />
   ),
   cell: ({ row }) => <TableActionButtons row={row} />,
   enableSorting: false,
   enableHiding: false,
 },
];