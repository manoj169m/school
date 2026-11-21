"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import Loading from "@/app/loading";
import { HostelData } from "./table/columns";

export default function AddRoom() {
  const [data, setData] = useState<HostelData[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("/api/rooms", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(error);
        
        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.message || "Failed to fetch hostel data");
        }
        
        const result = await response.json();
        
        // Log the raw response to console
        console.log('Raw API Response:', result);
        
        // Ensure result is an array
        const hostelData: HostelData[] = Array.isArray(result) ? result : [result];
        
        console.log('Processed Hostel Data:', hostelData);
        
        setData(hostelData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        console.error('Fetch Error:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRooms();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  // if (error) {
  //   return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  // }

  // Add a debug log to check data before rendering
  console.log('Data before rendering:', data);

  return (
    <div className="p-4">
     
        <DataTable data={data} columns={columns} />
      
        
    </div>
  );
}