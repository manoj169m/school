import { Breadcrumbs } from "@/components/breadcrumbs";
import SelectIncomeCollection from "@/components/process/finance/incomeCollection/SelectIncomeCollection";
import React from "react";

const breadcrumbItems = [
  { title: "Process", link: "/" },
  { title: "Finance", link: "#" },
  { title: "Income Collection", link: "/process/Finance/incomeCollection" },
];

function page() {
  return (
    <div className="p-4">
      {/* Header with Breadcrumbs */}
      <div className="flex justify-between items-center m-5">
        {/* Page Name */}
        <div className="text-left">
          <h1 className="text-2xl font-semibold text-black">
            Income Collection
          </h1>
          {/* Optionally uncomment this line for a description */}
          <p className="text-sm text-slate-600">Select student details</p>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Student Remove Form */}

      <SelectIncomeCollection />
    </div>
  );
}

export default page;
