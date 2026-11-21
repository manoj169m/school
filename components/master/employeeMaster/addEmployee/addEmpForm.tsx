"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftCircle,
  BriefcaseBusiness,
  ContactRound,
  DollarSign,
  LockKeyhole,
  MessageSquareWarning,
  UserPlus,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import EmpPersonalForm from "./form/personal";
import EmpContactForm from "./form/contact";
import EmpJobForm from "./form/job";
import EmpReportingForm from "./form/reporting";
import EmpSalaryForm from "./form/salary";
import EmpSecurityForm from "./form/security";

// Type definition for view
type ViewType =
  | "personal"
  | "contact"
  | "job"
  | "reporting"
  | "salary"
  | "security";

// Navigation items configuration
const NAVIGATION_ITEMS = [
  {
    view: "personal",
    icon: UserPlus,
    label: "Personal",
  },
  {
    view: "contact",
    icon: ContactRound,
    label: "Contact",
  },
  {
    view: "job",
    icon: BriefcaseBusiness,
    label: "Job ",
  },
  {
    view: "reporting",
    icon: MessageSquareWarning,
    label: "Reporting",
  },
  {
    view: "salary",
    icon: DollarSign,
    label: "Salary ",
  },
  {
    view: "security",
    icon: LockKeyhole,
    label: "Security",
  },
];

const EmpAddHeaderAndLinksContent: React.FC = () => {
  const searchParams = useSearchParams();
  // Use optional chaining and provide a default value
  const view = (searchParams?.get("view") as ViewType) || "personal";

  const RenderContent = () => {
    const formComponents = {
      personal: <EmpPersonalForm />,
      contact: <EmpContactForm />,
      job: <EmpJobForm />,
      reporting: <EmpReportingForm />,
      salary: <EmpSalaryForm />,
      security: <EmpSecurityForm />,
    };

    return formComponents[view] || formComponents.personal;
  };

  const breadcrumbItems = [
    { title: "Master", link: "/" },
    { title: "Employee Master", link: "#" },
    { title: "Add Employee", link: "/master/EmployeeMaster/addEmployee" },
  ];

  return (
    <div>
      {/* Header with Breadcrumbs */}
      <div className="flex justify-between items-center mr-10">
        {/* Header Section */}
        <div className="text-left mt-6 ml-6">
          <h1 className="text-lg lg:text-xl 2xl:text-2xl font-semibold text-black">
            Add Employee
          </h1>
          <p className="text-sm lg:text-md  2xl:text-lg text-slate-600">
            Manage New Employee Details Forms.
          </p>
        </div>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Navigation Section*/}
      <div className="flex flex-col items-center rounded-lg p-6 space-y-8 w-full">
        <div className="w-full bg-white p-3 flex flex-wrap gap-2 items-center justify-center md:justify-start flex-nowrap">
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
  px-2 py-2 xs:px-2 xs:py-2 sm:px-3 sm:py-3 md:px-3 md:py-3 lg:px-2 lg:py-2  2xl:px-4 2xl:py-4 lg:w-full md:w-full flex items-center justify-center gap-x-4 rounded-md text-white text-xs md:text-sm lg:text-md xl:text-lg 2xl:text-xl`}
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
const EmpAddHeaderAndLinks: React.FC = () => (
  <Suspense fallback={<div>Loading admission data...</div>}>
    <EmpAddHeaderAndLinksContent />
  </Suspense>
);

export default EmpAddHeaderAndLinks;
