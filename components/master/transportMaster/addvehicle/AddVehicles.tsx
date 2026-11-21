"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";

export default function AddVehicles() {
  const [data, setData] = useState([]);
  const [error, setError] = useState<string | null>(null); // Explicitly define the type

  useEffect(() => {
    async function fetchFeeCategories() {
      try {
        const response = await fetch("/api/vehicles");
        if (!response.ok) {
          throw new Error("Failed to fetch fee categories");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        // Check if `err` has a `message` property, otherwise use a default message
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage); // Now this works
      }
    }

    fetchFeeCategories();
  }, []);

  

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <DataTable data={data} columns={columns} />
    </div>
  );

}
