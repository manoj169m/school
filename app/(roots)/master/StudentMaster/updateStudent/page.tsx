"use client"
import React from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import StudentUpdate from "@/components/master/studentMaster/updateStudent/UpdateSelectionForm";

const breadcrumbItems = [
  { title: "Master", link: "/" },
  { title: "Student Master", link: "#" },
  { title: "Update Student", link: "/master/StudentMaster/updateStudent" },
];
function page() {
  return (
    <div className="h-full flex-1 flex-col p-8 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h1 className="text-gray-800 text-2xl font-bold mb-2">
            Student Update
          </h1>
          <p className="text-sm lg:text-md 2xl:text-lg text-slate-600">
            Manage Student Update Forms
          </p>
        </div>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
     <StudentUpdate/>
    </div>
  );
}

export default page;
