"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { ArrowUpDown } from "lucide-react";
import { Branch } from "../branch";

// Enhanced columns with better styling and interaction
export const columns: ColumnDef<Branch>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-blue-50 transition-colors"
      >
        Schools Id
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase ml-10 text-sm text-gray-600 hover:text-blue-600 transition-colors">
        {row.getValue("id")}
      </div>
    ),
  },
  // Schools Name
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-blue-50 transition-colors"
      >
        Schools Name
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase ml-10 text-sm text-gray-600 hover:text-blue-600 transition-colors">
        {row.getValue("name")}
      </div>
    ),
  },

  //Schools Acronym
  {
    accessorKey: "acronym",
    header: () => (
      <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
        Schools Acronym
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase ml-10 text-sm text-gray-600 hover:text-blue-600 transition-colors">
        {row.getValue("acronym")}
      </div>
    ),
  },

  //label Name
  {
    accessorKey: "label",
    header: () => (
      <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
        label Name
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase ml-10 text-sm text-gray-600 hover:text-blue-600 transition-colors">
        {row.getValue("label")}
      </div>
    ),
  },

  //InCharge Name
  {
    accessorKey: "inCharge",
    header: () => (
      <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
        InCharge Name
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase ml-10 text-sm text-gray-600 hover:text-blue-600 transition-colors">
        {row.getValue("inCharge")}
      </div>
    ),
  },

  //Contact Name
  {
    accessorKey: "contact",
    header: () => (
      <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
        Contact
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase ml-10 text-sm text-gray-600 hover:text-blue-600 transition-colors">
        {row.getValue("contact")}
      </div>
    ),
  },
  // location
  {
    accessorKey: "location",
    header: () => (
      <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
        Location
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase ml-10 text-sm text-gray-600 hover:text-blue-600 transition-colors">
        {row.getValue("location")}
      </div>
    ),
  },

  // address
  {
    accessorKey: "address",
    header: () => (
      <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
        Address
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase ml-10 text-sm text-gray-600 hover:text-blue-600 transition-colors">
        {row.getValue("address")}
      </div>
    ),
  },
];
