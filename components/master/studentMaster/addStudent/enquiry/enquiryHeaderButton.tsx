"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftCircle,
  UserPlus,
} from "lucide-react";
import EnquiryForm from "./form/EnquiryForm";
import { Breadcrumbs } from "@/components/breadcrumbs";

// Type definition for view
type ViewType = "enquiry";

// Navigation items configuration
const NAVIGATION_ITEMS = [
  {
    view: "enquiry",
    icon: UserPlus,
    label: "Enquiry Form",
  },
];

const EnquiryHeaderAndLinksContent: React.FC = () => {
  const searchParams = useSearchParams();
  // Use optional chaining and provide a default value
  const view = (searchParams?.get("view") as ViewType) || "enquiry";

  const RenderContent = () => {
    const formComponents = {
      enquiry: <EnquiryForm />,
    };

    return formComponents[view] || formComponents.enquiry;
  };

  const breadcrumbItems = [
    { title: "Master", link: "/" },
    { title: "Student Master", link: "#" },
    { title: "Add Student", link: "/master/StudentMaster/addStudent" },
    {
      title: "Enquiry",
      link: "/master/StudentMaster/addStudent/enquiry",
    },
  ];

  return (
    <div>
      {/* Header with Breadcrumbs */}
      <div className="flex justify-between items-center mr-10">
        {/* Header Section */}
        <div className="text-left mt-6 ml-6">
          <h1 className="text-lg lg:text-xl 2xl:text-2xl font-semibold text-black">
            Student Enquiry
          </h1>
          <p className="text-sm lg:text-md  2xl:text-lg text-slate-600">
            Manage Student Enquiry Forms.
          </p>
        </div>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Navigation Section */}
      <div className="flex flex-col items-center rounded-lg p-6 space-y-8 w-full">
        <div className="w-full bg-white p-3 flex flex-wrap gap-2 items-center justify-center md:justify-start ">
          {/* Back Link */}
          <Link
            href="/master/StudentMaster/addStudent"
            className="bg-custom-pink-300 hover:bg-custom-red-600 px-2 py-2 xs:px-2 xs:py-2 sm:px-3 sm:py-3 md:px-4 md:py-3 lg:px-3 lg:py-3  2xl:px-4 2xl:py-4 flex items-center rounded-md text-white  "
          >
            <ArrowLeftCircle className="w-5 h-5 2xl:w-7 2xl:h-7" />
          </Link>

          {/* Dynamic Navigation Links */}
          {NAVIGATION_ITEMS.map(({ view: itemView, icon: Icon, label }) => (
            <Link
              key={itemView}
              href={`?view=${itemView}`}
              className={`${
                view === itemView
                  ? "bg-red-600"
                  : "bg-custom-pink-300 hover:bg-custom-red-600"
              } 
  px-2 py-2 xs:px-2 xs:py-2 sm:px-3 sm:py-3 md:px-4 md:py-3 lg:px-2 lg:py-2  2xl:px-4 2xl:py-4   flex items-center justify-center gap-x-4 rounded-md text-white text-xs md:text-sm lg:text-md xl:text-lg 2xl:text-xl`}
            >
              <Icon className="w-5 h-5  2xl:w-7 2xl:h-7" />
              <span className="hidden md:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="-mt-10">
        <RenderContent />
      </div>
    </div>
  );
};

// Suspense Wrapper
const EnquiryHeaderAndLinks: React.FC = () => (
  <Suspense fallback={<div>Loading enquiry form data...</div>}>
    <EnquiryHeaderAndLinksContent />
  </Suspense>
);

export default EnquiryHeaderAndLinks;
