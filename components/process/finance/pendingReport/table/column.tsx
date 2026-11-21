// columns.tsx
import { ColumnDef } from "@tanstack/react-table";

export interface Payment {
  id: string;
  name: string;
  rollNumber: string;
  gender: string;
  admissionNo: string;
  branch: string;
  village: string;
  mobileNo: string;
  class: string;
  section: string;
  accountWiseDetails: Array<{
    accountId: number;
    accountName: string;
    targetFee: number;
    concession: number;
    paid: number;
    pending: number;
  }>;
  totalTargetFee: number;
  totalConcession: number;
  totalPaid: number;
  totalPending: number;
}

// Base columns for consolidated view
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "admissionNo",
    header: "Admission No",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "rollNumber",
    header: "Roll No",
  },
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "totalTargetFee",
    header: "Total Target Fee",
    cell: ({ row }) => {
      return <div className="text-right">{row.original.totalTargetFee.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "totalConcession",
    header: "Total Concession",
    cell: ({ row }) => {
      return <div className="text-right">{row.original.totalConcession.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "totalPaid",
    header: "Total Paid",
    cell: ({ row }) => {
      return <div className="text-right">{row.original.totalPaid.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "totalPending",
    header: "Total Pending",
    cell: ({ row }) => {
      return <div className="text-right">{row.original.totalPending.toLocaleString()}</div>;
    },
  },
];

// Function to generate columns for split view based on account names
export const getAccountWiseColumns = (accountNames: string[]): ColumnDef<Payment>[] => {
  const baseColumns = columns.slice(0, 5); // Keep only the basic info columns

  const accountColumns: ColumnDef<Payment>[] = accountNames.flatMap(accountName => [
    {
      accessorFn: (row) => {
        const detail = row.accountWiseDetails.find(d => d.accountName === accountName);
        return detail?.targetFee || 0;
      },
      header: `${accountName} Target`,
      cell: ({ getValue }) => {
        return <div className="text-right">{(getValue() as number).toLocaleString()}</div>;
      },
    },
    {
      accessorFn: (row) => {
        const detail = row.accountWiseDetails.find(d => d.accountName === accountName);
        return detail?.concession || 0;
      },
      header: `${accountName} Concession`,
      cell: ({ getValue }) => {
        return <div className="text-right">{(getValue() as number).toLocaleString()}</div>;
      },
    },
    {
      accessorFn: (row) => {
        const detail = row.accountWiseDetails.find(d => d.accountName === accountName);
        return detail?.paid || 0;
      },
      header: `${accountName} Paid`,
      cell: ({ getValue }) => {
        return <div className="text-right">{(getValue() as number).toLocaleString()}</div>;
      },
    },
    {
      accessorFn: (row) => {
        const detail = row.accountWiseDetails.find(d => d.accountName === accountName);
        return detail?.pending || 0;
      },
      header: `${accountName} Pending`,
      cell: ({ getValue }) => {
        return <div className="text-right">{(getValue() as number).toLocaleString()}</div>;
      },
    },
  ]);

  return [...baseColumns, ...accountColumns];
};