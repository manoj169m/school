import { Breadcrumbs } from "@/components/breadcrumbs";
import ImageTracker from "@/components/studentImage/studentImgUpload/AttendanceTracker";
import React from "react";

export default function page() {
  const breadcrumbItems = [
    { title: "Master", link: "/" },
    {
      title: "Student Image Upload",
      link: "/master/studentMaster/studentImageUpload",
    },
  ];
  return (
    <div className="h-full flex-1 flex-col p-8 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <p className="text-gray-800 text-2xl font-bold mb-2">
            Student Image Upload{" "}
          </p>
          <div className="gradient-text text-4xl font-extrabold"></div>
        </div>
        <div>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="">
        <ImageTracker />
      </div>
    </div>
  );
}
