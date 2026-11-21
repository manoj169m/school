"use client";

// import Image from "next/image";
import * as React from "react";

import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";

export default function AddTimetable() {
  const [data, setData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log(error);

  useEffect(() => {
    async function fetchSections() {
      try {
        const response = await fetch("/api/classes");
        if (!response.ok) {
          throw new Error("failed to fetch Classes");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage); // Now this works
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
    fetchSections();
  }, []);

  if (isLoading) {
    return <Loading />; // Show loading animation
  }

  // if (error) {
  //   return <div className="text-red-500">Error: {error}</div>; // Display error
  // }
  return (
    <div>
      <DataTable data={data} columns={columns} />
    </div>
  );
}
