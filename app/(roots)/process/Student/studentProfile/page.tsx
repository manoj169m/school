"use client";
import React from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import StudentProfileSelectionForm from "@/components/process/students/studentProfile/ProfileSelectionForm";

const breadcrumbItems = [
  { title: "Process", link: "/" },
  { title: "Student process", link: "#" },
  { title: "Student Profile", link: "/process/student/studentProfile" },
];
function page() {
  return (
    <div className="h-full flex-1 flex-col p-8 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h1 className="text-gray-800 text-2xl font-bold mb-2">
            Student Profile
          </h1>
          <p className="text-sm lg:text-md 2xl:text-lg text-slate-600">
            Manage Student Profile Details
          </p>
        </div>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <StudentProfileSelectionForm />
    </div>
  );
}

export default page;
