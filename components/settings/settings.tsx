"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Fingerprint,
  LockKeyhole,
  ScanEye,
  School,
  Split,
  UserPen,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import SettingsProfileForm from "./form/profile/profile";
import SettingsAccountForm from "./form/account";
import SettingsBranchForm from "./form/branch/branch";
import SettingsAcademicYearForm from "./form/academic year/academicYear";
import SettingsAuthForm from "./form/auth";
import SettingsPermissionForm from "./form/permission";

// Type definition for view
type ViewType =
  | "profile"
  | "account"
  | "branch"
  | "academicYear"
  | "auth"
  | "permission";

// Navigation items configuration
const NAVIGATION_ITEMS = [
  {
    view: "profile",
    icon: UserPen,
    label: "Profile",
  },
  {
    view: "account",
    icon: Fingerprint,
    label: "Account",
  },
  {
    view: "branch",
    icon: Split,
    label: "Branch",
  },
  {
    view: "academicYear",
    icon: School,
    label: "Academic Year",
  },
  {
    view: "auth",
    icon: ScanEye,
    label: "Auth ",
  },
  {
    view: "permission",
    icon: LockKeyhole,
    label: "Permission",
  },
];

const SettingsHeaderAndLinksContent: React.FC = () => {
  const searchParams = useSearchParams();
  // Use optional chaining and provide a default value
  const view = (searchParams?.get("view") as ViewType) || "profile";

  const RenderContent = () => {
    const formComponents = {
      profile: <SettingsProfileForm />,
      account: <SettingsAccountForm />,
      branch: <SettingsBranchForm />,
      academicYear: <SettingsAcademicYearForm />,
      auth: <SettingsAuthForm />,
      permission: <SettingsPermissionForm />,
    };

    return formComponents[view] || formComponents.profile;
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Settings", link: "/settings" },
  ];

  return (
    <div>
      {/* Header with Breadcrumbs */}
      <div className="flex justify-between items-center mr-10">
        {/* Header Section */}
        <div className="text-left mt-6 ml-6">
          <h1 className="text-lg lg:text-xl 2xl:text-2xl font-semibold text-black">
            Settings
          </h1>
          <p className="text-sm lg:text-md  2xl:text-lg text-slate-600">
            Manage settings details.
          </p>
        </div>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Navigation Section*/}
      <div className="flex flex-col items-center rounded-lg p-6 space-y-8 w-full">
        <div className="w-full bg-white p-3 flex flex-wrap gap-2 items-center justify-center md:justify-start flex-nowrap">
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
const SettingsHeaderAndLinks: React.FC = () => (
  <Suspense fallback={<div>Loading admission data...</div>}>
    <SettingsHeaderAndLinksContent />
  </Suspense>
);

export default SettingsHeaderAndLinks;
