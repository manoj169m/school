"use client";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";


export default function AddSection() {
  const [data, setData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    async function fetchSections() {
      try {
        const response = await fetch("/api/sections");
        if (!response.ok) {
          throw new Error("Failed to fetch Sections");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
    fetchSections();
  }, []);

  if (isLoading) {
    return <Loading />; // Show loading animation
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>; // Display error
  }

  return <DataTable data={data} columns={columns} />;
}
