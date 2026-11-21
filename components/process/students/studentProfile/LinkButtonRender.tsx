"use client";
import React, { Suspense, useEffect, useState } from "react";
import { CalendarDays, CreditCard, UserPlus } from "lucide-react";
import PersonalDetails from "./forms/personalDetails";
import AttendanceTracker from "./forms/attendanceDetails";
import PaymentDetails from "./forms/studentPaymentDetails";
import { fetchWithRetry } from "@/utils/apiUtils";

// Define the shared interfaces for student data structure
interface Student {
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
  admissionNo: string;
  applicationNo?: string;
  rollNo: string;
}

interface TransportAssignment {
  routeId: number;
  stopId: number;
  academicYearId: number;
  route?: { routeName: string };
  stop?: { stopName: string };
}

interface TransportDetails {
  transportAssignment: TransportAssignment | null;
}

interface HostelAssignment {
  hostelId: number;
  roomId: number;
  hostel: { hostelName: string };
  room: { floorNumber: string; roomNumber: string };
}

interface HostelDetails {
  hostelAssignment: HostelAssignment | null;
}

interface Concession {
  concessionId: number;
  accountId: number;
  amount: number;
  reason: string;
  term: string;
  account: {
    accountName: string;
  };
}

interface CurrentEnrollment {
  id: number;
  enrollmentDate: string | Date;
  academicYearId: number;
  branchId: number;
  branchName: string;
  classId: number;
  sectionId: number;
  section: string;
  class: string;
  academicYear: string;
  feeCategoryName: string;
  transportStatus: string;
  hostelStatus: string;
  joinYear: string;
  classJoin: string;
  admissionNo: string;
  applicationNo?: string;
  rollNo: string;
  status?: string;
}

interface Fee {
  accountId: number;
  amount: number;
  dueDate: string;
  term: number;
  account: {
    accountName: string;
  };
}

interface Payment {
  accountId: number;
  amount: number;
  term: number;
  account: {
    accountName: string;
  };
  paymentDetails: Array<{
    amount: number;
    collectedDate: string;
    receiptNumber: string;
  }>;
}

interface StudentFee {
  regularFeesTotal: number;
  transportFeeTotal: number;
  hostelFeeTotal: number;
  totalConcessions: number;
  totalFee: number;
  individualFee: number;
  finalFee: number;
  balanceAmount: number;
  regularFees: Fee[];
  payments: Payment[];
  concession: number;
  paidAmount: number;
  hostelFee?: Fee | null;
  transportFee?: Fee | null;
  individualFees: Fee[];
  concessions: Concession[];
}

interface StudentDetails {
  name: string;
  fatherName: string;
  branch: string;
  contactNo: string;
  phoneNo: string;
  class: string;
  section: string;
  academicYear: string;
  admissionNo: string;
  rollNo: string;
}

interface StudentData {
  student: Student;
  currentEnrollment: CurrentEnrollment;
  transportDetails?: TransportDetails;
  hostelDetails?: HostelDetails;
  studentFee: StudentFee;
  attendanceData: AttendanceData;
  studentDetails: StudentDetails;
  academicYearId: number;
  branchId: number;
  classId: number;
  sectionId: number;
  studentFeeId: number;
  studentId: number;
  enrollmentId: number;
  regularFees: Fee[];
  transportFee: Fee | null;
  hostelFee: Fee | null;
  individualFees: Fee[];
  concessions: Concession[];
  payments: Payment[];
}

interface AttendanceRecord {
  date: string;
  day: string;
  status: "P" | "A" | "L" | "FN" | "AN" | "H" | "OD";
  remarks?: string | null;
}

interface AttendanceData {
  studentAttendance: {
    attendanceRecords: AttendanceRecord[];
    summary?: {
      totalDays: number;
      presentDays: number;
      absentDays: number;
      percentage: number;
    };
  };
  currentEnrollment: {
    academicYear: string;
    className: string;
    sectionName: string;
    branchName: string;
  };
  student: {
    // Added student interface
    id: number;
    studentName: string;
    admissionNo: string | null;
    rollNo: string | null;
  };
}

interface LinkButtonRenderProps {
  enrollmentId: string;
}

// Type definition for view
type ViewType = "personalDetails" | "attendanceDetails" | "paymentDetails";

interface ApiResponse {
  personalDetails: StudentData;
  attendanceDetails: AttendanceData;
  paymentDetails: StudentData;
}

const NAVIGATION_ITEMS = [
  {
    view: "personalDetails" as const,
    icon: UserPlus,
    label: "Personal Details",
    endpoint: (id: string) => `/api/students/${id}`,
  },
  {
    view: "attendanceDetails" as const,
    icon: CalendarDays,
    label: "Attendance Details",
    endpoint: (id: string) => `/api/attendance/${id}`,
  },
  {
    view: "paymentDetails" as const,
    icon: CreditCard,
    label: "Payment Details",
    endpoint: (id: string) => `/api/students/payment/${id}`,
  },
] as const;

const LinkButtonRendeDetails: React.FC<LinkButtonRenderProps> = ({
  enrollmentId,
}) => {
  const [activeView, setActiveView] = useState<ViewType | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<Partial<ApiResponse>>({});

  useEffect(() => {
    setActiveView(undefined);
    setApiData({});
    setError(null);
  }, [enrollmentId]);

  const fetchData = async (view: NonNullable<ViewType>) => {
    if (!view) return;

    setLoading(true);
    setError(null);

    try {
      const navItem = NAVIGATION_ITEMS.find((item) => item.view === view);
      if (!navItem) throw new Error("Invalid view type");

      const endpoint = navItem.endpoint(enrollmentId);
      const data = await fetchWithRetry(endpoint);

      setApiData((prev) => ({
        ...prev,
        [view]: data,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle view change and fetch data
  const handleViewChange = async (view: ViewType) => {
    setActiveView(view);
    if (!apiData[view]) {
      await fetchData(view);
    }
  };

  const RenderContent = () => {
    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (error)
      return <div className="text-center py-12 text-red-500">{error}</div>;
    if (!activeView) return null;

    const viewData = apiData[activeView];
    if (!viewData) return null;

    const components = {
      personalDetails: () => (
        <PersonalDetails studentData={viewData as StudentData} />
      ),
      attendanceDetails: () => (
        <AttendanceTracker attendanceData={viewData as AttendanceData} />
      ),
      paymentDetails: () => (
        <PaymentDetails studentData={viewData as StudentData} />
      ),
    };

    return components[activeView]();
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Section */}
      <div className="flex flex-col items-center rounded-lg w-full">
        <div className="w-full bg-white rounded-lg shadow-xl p-3 flex flex-wrap gap-2 items-center justify-center md:justify-start">
          {/* Navigation Buttons */}
          {NAVIGATION_ITEMS.map(({ view, icon: Icon, label }) => (
            <button
              key={view}
              onClick={() => handleViewChange(view)}
              className={`${
                activeView === view
                  ? "bg-red-600 text-white"
                  : "bg-white border border-red-600 font-bold text-red-600 hover:text-white hover:bg-red-600"
              } 
              px-4 py-3 flex items-center justify-center gap-x-4 rounded-md 
              text-sm md:text-base transition-colors duration-200 w-full md:w-auto`}
              disabled={loading}
            >
              <Icon className="w-5 h-5 2xl:w-6 2xl:h-6" />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="mt-6">
        {activeView ? (
          <div>
            <RenderContent />
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Select a section to view details
          </div>
        )}
      </div>
    </div>
  );
};

interface LinkButtonRenderProps {
  enrollmentId: string;
}

// Suspense Wrapper
const LinkButtonRender: React.FC<LinkButtonRenderProps> = ({
  enrollmentId,
}) => (
  <Suspense fallback={<div>Loading profile data...</div>}>
    <LinkButtonRendeDetails enrollmentId={enrollmentId} />
  </Suspense>
);

export default LinkButtonRender;
