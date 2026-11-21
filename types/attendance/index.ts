// types/attendance.ts

export type AttendanceStatus = 'P' | 'A' | 'L' | 'FN' | 'AN' | 'H' | 'OD';

export const AttendanceStatusLabels: Record<AttendanceStatus, string> = {
  'P': 'Present',
  'A': 'Absent',
  'L': 'Leave',
  'FN': 'Morning Present',
  'AN': 'Afternoon Present',
  'H': 'Holiday',
  'OD': 'On Duty'
};

export interface Student {
  id: number;
  enrollmentId: number;
  firstName: string;
  lastName?: string;
  branchId?: number;
  branchName?: string;
  className?: string;
  classId?: number;
  sectionId?: number;
  sectionName?: string;
  admissionNo?: string;
  rollNo?: string;
  status: AttendanceStatus;
  enrollmentStatus: string;
  remarks?: string;
}

export interface FormValues {
  academicYearId: string;
  branchIds: string[];
  classIds: string[];
  sectionIds: string[];
  date: Date;
}

export interface AttendanceFormValues {
  academicYear: string;
  branches: string[];
  classes: string[];
  sections: string[];
  date: Date;
}



export interface ComboboxOption {
  label: string;
  value: string;
}

export interface FormData {
  values: FormValues | null;
  date: Date | null;
}

export interface AttendanceRecord {
  enrollmentId: number;
  status: AttendanceStatus;
  branchId: number;
  classId: number;
  sectionId: number;
  remarks?: string;
}

export interface AttendancePayload {
  academicYearId: number;
  branchIds: number[];
  classIds: number[];
  sectionIds: number[];
  date: string;
  attendanceRecords: AttendanceRecord[];
  forceUpdate: boolean;
}
 

export interface AttendanceData {
  id: number;
  date: Date;
  totalPresent: number;
  totalAbsent: number;
  totalStudents: number;
  details: AttendanceDetail[];
}

 export interface AttendanceDetail {
  id: number;
  status: "P" | "A" | "L" | "FN" | "AN" | "H" | "OD";
  enrollment: {
    student: {
      firstName: string;
      lastName: string;
      rollNo: string;
    };
  };
}
