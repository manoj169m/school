"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns"; // Ensure columns are updated for designation data
import Loading from "@/app/loading";

export default function Designation() {
  const [data, setData] = useState([]); // Designation data
  const [error, setError] = useState<string | null>(null); // Error message
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    async function fetchDesignations() {
      try {
        const response = await fetch("/api/designation"); // Updated API endpoint for designations
        if (!response.ok) {
          throw new Error("Failed to fetch designations");
        }
        const result = await response.json();
        setData(result); // Set designation data
      } catch (err) {
        // Check if `err` has a `message` property, otherwise use a default message
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage); // Set error message
      } finally {
        setIsLoading(false); // Stop loading
      }
    }

    fetchDesignations();
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  if (isLoading) {
    return <Loading />; // Show loading animation while data is being fetched
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>; // Display error message if fetching fails
  }

  return <DataTable data={data} columns={columns} />; // Render the DataTable component with designation data
}
