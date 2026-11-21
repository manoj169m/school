import { Breadcrumbs } from "@/components/breadcrumbs";
import PaymentForm from "@/components/process/finance/pendingReport/paymentForm";
import React from "react";


const breadcrumbItems = [
  { title: "Process", link: "/" },
  { title: "Finance", link: "#" },
  { title: "Pending payments", link: "/process/Finance/pendingReport" },
];

function page() {
  return (
    <div className="p-4">
      {/* Header with Breadcrumbs */}
      <div className="flex justify-between items-center m-5">
        {/* Page Name */}
        <div className="text-left">
          <h1 className="text-2xl font-semibold text-black">
           Pending Report
          </h1>
          {/* Optionally uncomment this line for a description */}
          <p className="text-sm text-slate-600">Select student details</p>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Student Remove Form */}

      <PaymentForm/>
    </div>
  );
}

export default page;
