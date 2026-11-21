import { Breadcrumbs } from "@/components/breadcrumbs";
import PaymentReport from "@/components/process/finance/collectionReport/collectionReport";
import React from "react";

const breadcrumbItems = [
  { title: "Process", link: "/" },
  { title: "Finance", link: "#" },
  { title: "Daily Collection Report", link: "/process/Finance/collectionReport" },
];

function page() {
  return (
    <div className="p-4">
      {/* Header with Breadcrumbs */}
      <div className="flex justify-between items-center m-5">
        {/* Page Name */}
        <div className="text-left">
          <h1 className="text-2xl font-semibold text-black">
          Payment Report
          </h1>
          {/* Optionally uncomment this line for a description */}
          <p className="text-sm text-slate-600">Generate and analyze payment collections across different parameters</p>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Student Remove Form */}
     <PaymentReport/>
      
    </div>
  );
}

export default page;
