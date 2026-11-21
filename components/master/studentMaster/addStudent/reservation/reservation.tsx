"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftCircle,
  GraduationCap,
  HandHeart,
  ShieldCheck,
  Trophy,
  UserPlus,
} from "lucide-react";
import ReservationForm from "./forms/reservationForm";
import StudentParentForm from "./forms/studentParent";
import PreQualificationForm from "./forms/preQualificationForm";
import ActivitiesForm from "./forms/activities";
import CertificatesForm from "./forms/certificates";
import { Breadcrumbs } from "@/components/breadcrumbs";


// Type definition for view
type ViewType =
  | "reservation"
  | "parent"
  | "prequalification"
  | "activities"
  | "certificates";

// Navigation items configuration
const NAVIGATION_ITEMS = [
  {
    view: "reservation",
    icon: UserPlus,
    label: "Reservation",
  },
  {
    view: "parent",
    icon: HandHeart,
    label: "Student/Parent",
  },
  {
    view: "prequalification",
    icon: GraduationCap,
    label: "Qualification",
  },
  {
    view: "activities",
    icon: Trophy,
    label: "Activities",
  },
  {
    view: "certificates",
    icon: ShieldCheck,
    label: "Certificates",
  },
];

const ReservationHeaderAndLinksContent: React.FC = () => {
  const searchParams = useSearchParams();
  // Use optional chaining and provide a default value
  const view = (searchParams?.get("view") as ViewType) || "reservation";

  const RenderContent = () => {
    const formComponents = {
      reservation: <ReservationForm />,
      parent: <StudentParentForm />,
      prequalification: <PreQualificationForm />,
      activities: <ActivitiesForm />,
      certificates: <CertificatesForm />,
    };

    return formComponents[view] || formComponents.reservation;
  };
  const breadcrumbItems = [
    { title: "Master", link: "/" },
    { title: "Student Master", link: "#" },
    { title: "Add Student", link: "/master/StudentMaster/addStudent" },
    {
      title: "Reservation",
      link: "/master/StudentMaster/addStudent/reservation",
    },
  ];

  return (
    <div>
      {/* Header with Breadcrumbs */}
      <div className="flex justify-between items-center mr-10">
        {/* Header Section */}
        <div className="text-left mt-6 ml-6">
          <h1 className="text-lg lg:text-xl 2xl:text-2xl font-semibold text-black">
            Student Reservation
          </h1>
          <p className="text-sm lg:text-md  2xl:text-lg text-slate-600">
            Manage Student Reservation Forms.
          </p>
        </div>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Navigation Section */}
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
  px-2 py-2 xs:px-2 xs:py-2 sm:px-3 sm:py-3 md:px-4 md:py-3 lg:px-2 lg:py-2  2xl:px-4 2xl:py-4  lg:w-full md:w-full flex items-center justify-center gap-x-4 rounded-md text-white text-xs md:text-sm lg:text-md xl:text-lg 2xl:text-xl`}
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
const ReservationHeaderAndLinks: React.FC = () => (
  <Suspense fallback={<div>Loading reservation data...</div>}>
    <ReservationHeaderAndLinksContent />
  </Suspense>
);

export default ReservationHeaderAndLinks;
