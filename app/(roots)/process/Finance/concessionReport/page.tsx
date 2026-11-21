import { Breadcrumbs } from "@/components/breadcrumbs";
import ConcessionForm from "@/components/process/finance/concessionReport/concessionForm";
import React from "react";


const breadcrumbItems = [
  { title: "Process", link: "/" },
  { title: "Finance", link: "#" },
  { title: "Concession Report", link: "/process/Finance/concessionReport" },
];

function page() {
  return (
    <div className="p-4">
      {/* Header with Breadcrumbs */}
      <div className="flex justify-between items-center m-5">
        {/* Page Name */}
        <div className="text-left">
          <h1 className="text-2xl font-semibold text-black">
           Concession Report
          </h1>
          {/* Optionally uncomment this line for a description */}
          <p className="text-sm text-slate-600">Select the given details for get concession report</p>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Student Remove Form */}
<ConcessionForm/>
     
    </div>
  );
}

export default page;
