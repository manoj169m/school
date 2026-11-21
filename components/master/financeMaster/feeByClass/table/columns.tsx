import { ColumnDef } from "@tanstack/react-table";

// Fee interface with more comprehensive type definitions
export interface Fee {
  id: number;
  account?: { 
    id: string | number; 
    accountName?: string;
  };
  term?: number;
  amount?: number;
  incomeType?: string;
  gender?: string;
  admissionOnly?: boolean;
  daysScholarOnly?: boolean;
  dueDate?: Date;
}
// Default columns definition
export const feeColumns: ColumnDef<Fee>[] = [
  {
    accessorKey: "account.id",
    header: "Account ID",
    cell: ({ row }) => row.original.account?.accountName ?? "N/A",
  },
  {
    accessorKey: "term",
    header: "Term",
    cell: ({ getValue }) => getValue() ?? "N/A",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => {
      const amount = getValue();
      return amount ? `₹${Number(amount).toLocaleString()}` : "N/A";
    },
  },
  {
    accessorKey: "incomeType",
    header: "Income Type",
    cell: ({ getValue }) => getValue() ?? "N/A",
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ getValue }) => getValue() ?? "N/A",
  },
  {
    accessorKey: "admissionOnly",
    header: "Admission Only",
    cell: ({ getValue }) => getValue() ? "Yes" : "No",
  },
  {
    accessorKey: "daysScholarOnly",
    header: "Day Scholar Only",
    cell: ({ getValue }) => getValue() ? "Yes" : "No",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate = new Date(row.getValue("dueDate")); // Convert the date to a Date object
      const formattedDate = dueDate.toLocaleDateString("en-IN", {
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
  }
  
];