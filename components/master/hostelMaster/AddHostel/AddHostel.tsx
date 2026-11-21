'use client';

import { useEffect, useState } from "react";
import { DataTable } from "./table/data-table"; // Assuming your table component is reusable
import { columns } from "./table/columns"; // Assuming you have columns defined for hostel data
import Loading from "@/app/loading"; // Assuming you have a loading component

export default function Hostel() {
  const [data, setData] = useState([]); // To store fetched hostel data
  const [error, setError] = useState<string | null>(null); // To store error message
  const [isLoading, setIsLoading] = useState(true); // To track loading state

  useEffect(() => {
    async function fetchHostels() {
      try {
        const response = await fetch("/api/hostels"); // Adjust the API endpoint to match your backend
        console.log(response)
        if (!response.ok) {
          throw new Error("Failed to fetch hostel data");
        }
        const result = await response.json();
        setData(result); // Set the fetched hostel data
      } catch (err) {
        // Error handling
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage); // Set the error message
      } finally {
        setIsLoading(false); // Stop loading after data is fetched or error occurs
      }
    }

    fetchHostels(); // Call the fetch function on component mount
  }, []); // Empty dependency array ensures the fetch is triggered only once on mount

  if (isLoading) {
    return <Loading />; // Show loading indicator while data is being fetched
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>; // Show error message if fetch fails
  }

  return <DataTable data={data} columns={columns} />; // Render the table with fetched hostel data
}
