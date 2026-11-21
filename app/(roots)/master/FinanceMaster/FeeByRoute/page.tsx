import { Breadcrumbs } from "@/components/breadcrumbs";
import FeeByRoute from "@/components/master/financeMaster/feeByRoute/selectComponent";
import React from "react";

const breadcrumbItems = [
  { title: "Master", link: "/" },
  { title: "Finance Master", link: "#" },
  { title: "Fee By Route", link: "/master/FinanceMaster/FeeByRoute" },
];

function page() {
  return (
    <div className="p-4">
      {/* Header with Breadcrumbs */}
      <div className="flex justify-between items-center m-5">
        {/* Page Name */}
        <div className="text-left">
          <h1 className="text-2xl font-semibold text-black">
            Fee By Route
          </h1>
          {/* Optionally uncomment this line for a description */}
          <p className="text-sm text-slate-600">Select Route details</p>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Student Remove Form */}

      <FeeByRoute />
    </div>
  );
}

export default page;
