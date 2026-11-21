import { Breadcrumbs } from "@/components/breadcrumbs";
import FeeCategoryForm from "@/components/process/finance/feecard/selectionForm";
import React from "react";


const breadcrumbItems = [
  { title: "Process", link: "/" },
  { title: "Finance", link: "#" },
  { title: "Fee Card", link: "/process/Finance/feeCard" },
];

function page() {
  return (
    <div className="p-4">
      {/* Header with Breadcrumbs */}
      <div className="flex justify-between items-center m-5">
        {/* Page Name */}
        <div className="text-left">
          <h1 className="text-2xl font-semibold text-black">
            Fee Card
          </h1>
          {/* Optionally uncomment this line for a description */}
          <p className="text-sm text-slate-600">selected criteria.</p>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Student Remove Form */}
      <FeeCategoryForm />

    </div>
  );
}

export default page;
