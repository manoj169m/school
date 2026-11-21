"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  HandHeart,
  ShieldCheck,
  Trophy,
  UserPlus,
} from "lucide-react";

import StudentUpdateStudentParentForm from "./form/studentParent";
import StudentUpdatePreQualificationForm from "./form/preQualificationForm";
import StudentUpdateActivitiesForm from "./form/activities";
import StudentUpdateCertificatesForm from "./form/certificates";
import StudentUpdateForm from "./form/studentUpdateForm";

interface TransportAssignment {
  routeId: number;
  stopId: number;
  academicYearId: number;
}

interface TransportDetails {
  transportAssignment: TransportAssignment | null;
}

interface HostelAssignment {
  hostelId: number;
  roomId: number;
}

interface HostelDetails {
  hostelAssignment: HostelAssignment | null;
}

interface StudentData {
  studentData: {
    student: {
      id: number;
      firstName: string;
      lastName?: string;
      gender: "MALE" | "FEMALE" | "OTHER";
      dateOfBirth: string | Date;
      community?: string;
      caste?: string;
      bloodGroup?: string;
      motherTongue?: string;
      religion?: string;
      aadharNo?: string;
      emisNo?: string;
      placeOfBirth?: string;
      country: string;
      state: string;
      cityTownVillage: string;
      address: string;
      communicationNo: string;
      phoneNo: string;
      email: string;
      relationName1: string;
      relationType1: string;
      relationNo1: string;
      relationName2?: string;
      relationType2?: string;
      relationNo2?: string;
    };
    currentEnrollment: {
      enrollmentDate: string | Date;
      academicYearId: number;
      branchId: number;
      classId: number;
      sectionId: number;
      feeCategoryId: number;
      transportStatus: string;
      hostelStatus: string;
      joinYear: string;
      classJoin: string;
      admissionNo: string;
      applicationNo?: string;
      rollNo: string;
    };
    transportDetails?: TransportDetails;
    hostelDetails?: HostelDetails;
    studentFee: {
      totalFee: number;
      individualFee: number;
      finalFee: number;
      balanceAmount: number;
    };
  };
}

// Type definition for view
type ViewType =
  | "update"
  | "parent"
  | "prequalification"
  | "activities"
  | "certificates";

// Navigation items configuration
const NAVIGATION_ITEMS = [
  {
    view: "update",
    icon: UserPlus,
    label: "Update",
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

const UpdateAdmissionHeaderAndLinksContent: React.FC<StudentData> = ({
  studentData,
}) => {
  const searchParams = useSearchParams();
  const view = (searchParams?.get("view") as ViewType) || "update";

  const RenderContent = () => {
    const formComponents = {
      update: <StudentUpdateForm studentData={studentData} />,
      parent: <StudentUpdateStudentParentForm />,
      prequalification: <StudentUpdatePreQualificationForm />,
      activities: <StudentUpdateActivitiesForm />,
      certificates: <StudentUpdateCertificatesForm />,
    };

    return formComponents[view] || formComponents.update;
  };

  return (
    <div>
      {/* Navigation Section*/}
      <div className="flex flex-col items-center rounded-lg p-6 space-y-8 w-full">
        <div className="w-full bg-custom-pink-100 p-3 flex flex-wrap gap-2 items-center justify-center md:justify-start flex-nowrap">
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
const UpdateAdmissionHeaderAndLinks: React.FC<StudentData> = ({
  studentData,
}) => (
  <Suspense fallback={<div>Loading admission data...</div>}>
    <UpdateAdmissionHeaderAndLinksContent studentData={studentData} />
  </Suspense>
);


export default UpdateAdmissionHeaderAndLinks;
