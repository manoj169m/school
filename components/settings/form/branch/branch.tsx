"use client";

import React, { useState } from "react";
import { columns } from "./table/column";
import { DataTable } from "./table/data-table";

export interface Branch {
  id: number;
  name: string;
  acronym: string;
  label: string;
  inCharge: string;
  contact: string | null; // Make sure to accept string or null
  address: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}

const SettingsBranchForm: React.FC = () => {
  const [data, setData] = useState<Branch[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when the component mounts
  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/branches");

        if (!response.ok) {
          throw new Error("Failed to fetch branches");
        }

        const result: Branch[] = await response.json();
        setData(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        console.error("Error fetching branches:", errorMessage);
        setError(errorMessage);
      }
    }
    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <div className=" mx-auto py-5">
        <DataTable
          columns={columns}
          data={data}
          title="School Branches Settings"
          description="manage your schools (Branch) records"
        />
      </div>
    </div>
  );
};

export default SettingsBranchForm;
