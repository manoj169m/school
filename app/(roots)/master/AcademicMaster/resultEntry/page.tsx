import { Breadcrumbs } from "@/components/breadcrumbs";
// import Result from "@/components/master/academicMaster/resultEntry/Result";
import ResultEntryForm from "@/components/master/academicMaster/resultEntry/resultForm";


import React from "react";

const breadcrumbItems = [
  { title: "Master", link: "/" },
  { title: "Academics", link: "#" },
  { title: "Result Entry", link: "/master/AcademicMaster/resultEntry" },
];

function page() {
  return (
    <div className="h-full flex-1 flex-col p-8 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <p className="text-gray-800 text-2xl font-bold mb-2">
          Here&apos;s a list of Result Entries!
          </p>
          <div className="gradient-text text-4xl font-extrabold"></div>
        </div>
        <div>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
      <div className="overflow-x-auto  p-6 ">
       <ResultEntryForm
       
       />
      </div>
    </div>
  );
}

export default page;
