'use client';

import { useEffect, useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import Loading from "@/app/loading";

export default function Event() {
  const [data, setData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch add event");
        }
        const result = await response.json();
        setData(result.events); // Extract just the events array
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvent();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return <DataTable data={data} columns={columns} />;
}

