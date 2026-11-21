"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import Loading from "@/app/loading";

export default function FeeByHostel() {
  const [data, setData] = useState([]);
  const [error, setError] = useState<string | null>(null); // Explicitly define the type
  const [isLoading, setIsLoading] = useState(true);

  console.log(error);

  useEffect(() => {
    async function fetchFeeByHostel() {
      try {
        const response = await fetch("/api/fee-by-hostel");
        if (!response.ok) {
          throw new Error("Failed to fetch fee by hostel");
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

    fetchFeeByHostel();
  }, []);

  console.log(data);
  
  if (isLoading) {
    return <Loading />; // Show loading animation
  }

  

  return <DataTable data={data} columns={columns} />;
}
