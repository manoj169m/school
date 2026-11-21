"use client";

import React from "react";
import { DataTable } from "./table/data-table";
import { columns, Payment } from "./table/column";


// Simulate fetching data from an API
const fetchPayments = async (): Promise<Payment[]> => {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
    // Add more sample data...
  ];
};

// Main component to render the DataTable
const SettingsProfileForm: React.FC = () => {
  const [payments, setPayments] = React.useState<Payment[]>([]);

  // Fetch data when the component mounts
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPayments();
      setPayments(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className=" mx-auto py-5">
        <DataTable
          columns={columns}
          data={payments}
          title="Payment Management"
          description="View and manage your payment records"
        />
      </div>
    </div>
  );
};

export default SettingsProfileForm;
