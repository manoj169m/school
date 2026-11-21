"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import Loading from "@/app/loading";

export default function ConcessionCategory() {
  const [data, setData] = useState([]);
  const [error, setError] = useState<string | null>(null); // Explicitly define the type
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchConcessionCategories() {
      try {
        const response = await fetch("/api/concCategory");
        if (!response.ok) {
          throw new Error("Failed to fetch Concession categories");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        // Check if `err` has a `message` property, otherwise use a default message
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage); // Now this works
      } finally {
        setIsLoading(false); // Stop loading
      }
    }

    fetchConcessionCategories();
  }, []);

  if (isLoading) {
    return <Loading />; // Show loading animation
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>; // Display error
  }

  return <DataTable data={data} columns={columns} />;
}
