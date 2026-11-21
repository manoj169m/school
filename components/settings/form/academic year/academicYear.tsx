"use client";

import React, { useState } from "react";
import { columns } from "./table/column";
import { DataTable } from "./table/data-table";

const SettingsAcademicYearForm: React.FC = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when the component mounts
  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/academicYears");
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
    fetchData();
  }, []);
  console.log(error);
  

  // if (error) return <div>Error: {error}</div>;
  // if (!data.length) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className=" mx-auto py-5">
        <DataTable
          columns={columns}
          data={data}
          title="Academic Year Settings"
          description="manage your academic year records"
        />
      </div>
    </div>
  );
};

export default SettingsAcademicYearForm;
