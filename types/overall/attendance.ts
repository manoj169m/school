// types/attendance.ts
import { AttendanceStatus } from "@prisma/client";

export type AttendanceStatuses = keyof typeof AttendanceStatus;

export interface ClassAttendance {
  class: string;
  total: number;
  present: number;
  absent: number;
  leave: number;
  morningPresent: number;
  afternoonPresent: number;
  onDuty: number;
}

export function isValidStatus(status: string): status is AttendanceStatus {
  return Object.values(AttendanceStatus).includes(status as AttendanceStatus);
}

export const MORNING_VALID_STATUSES = ["P", "AN", "H"] as const;
export const AFTERNOON_VALID_STATUSES = ["P", "FN", "H"] as const;

export type MorningStatus = (typeof MORNING_VALID_STATUSES)[number];
export type AfternoonStatus = (typeof AFTERNOON_VALID_STATUSES)[number];

export const mapTypeToStatus = (type: string): AttendanceStatus => {
  const statusMap: Record<string, AttendanceStatus> = {
    present: "P",
    absent: "A",
    leave: "L",
    morning: "FN",
    afternoon: "AN",
    halfDay: "H",
    onDuty: "OD",
  } as const;

  return statusMap[type] || "P";
};
