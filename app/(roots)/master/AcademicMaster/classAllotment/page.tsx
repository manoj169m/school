import { Breadcrumbs } from "@/components/breadcrumbs";
import ClassAllotment from "@/components/master/academicMaster/classAllotment/ClassAllotment";
import React from "react";



const breadcrumbItems = [
    { title: "Academics", link: "/" },
    { title: "Class Allotment", link: "/master/AcademicMaster/addSection" },
  ];



function page() {

    return(
        <div className="h-full flex-1 flex-col p-8 space-y-6 md:space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <p className="text-gray-800 text-2xl font-bold mb-2">
              Here&apos;s a Section Allocation
            </p>
            <div className="gradient-text text-4xl font-extrabold">
             
            </div>
          </div>
          <div>
            <Breadcrumbs items={breadcrumbItems}/>
          </div>
         
        </div>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
  <ClassAllotment/>
        </div>
      </div>

    )
}

export default page;