'use client';

import { useEffect, useState } from "react";
import { AccountDataTable } from "./table/data-table";
import { columns } from "./table/columns"; // Adjust the column definition file
import Loading from "@/app/loading";

export default function Accounts() {
  const [data, setData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch("/api/accounts");
        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return <AccountDataTable data={data} columns={columns} />;
}
