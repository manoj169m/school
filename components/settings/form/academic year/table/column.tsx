"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { ArrowUpDown } from "lucide-react";
import { SettingsAcademicYearFormValues } from "@/lib/validation/settingsValidation";

// Payment type definition


// Enhanced columns with better styling and interaction
export const columns: ColumnDef<SettingsAcademicYearFormValues>[] = [
  // Academic Year Name
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-blue-50 transition-colors"
      >
        Academic Year Name
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase ml-10 text-sm text-gray-600 hover:text-blue-600 transition-colors">
        {row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "label",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-blue-50 transition-colors"
      >
        Academic Year Name
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase ml-10 text-sm text-gray-600 hover:text-blue-600 transition-colors">
        {row.getValue("label")}
      </div>
    ),
  },
  // Start Year Column
  {
    accessorKey: "startDate",
    header: () => (
      <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
        Start Year
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"));
      const formattedDate = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{formattedDate}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
  // End Year Column
  {
    accessorKey: "endDate",
    header: () => (
      <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
        End Year
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"));
      const formattedDate = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{formattedDate}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
];
