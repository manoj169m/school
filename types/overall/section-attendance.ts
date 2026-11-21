// types/section-attendance.ts
export interface SectionAttendanceStats {
  total: number;
  present: number;
  absent: number;
  leave: number;
  morningPresent: number;
  afternoonPresent: number;
  onDuty: number;
}

export interface SectionAttendanceResponse {
  [sectionName: string]: SectionAttendanceStats;
}

export const ATTENDANCE_STATUS = {
  PRESENT: "P",
  ABSENT: "A",
  LEAVE: "L",
  FORENOON: "FN",
  AFTERNOON: "AN",
  HALF_DAY: "H",
  ON_DUTY: "OD",
} as const;

export const MORNING_PRESENT_STATUSES = ["P", "AN", "H"] as const;
export const AFTERNOON_PRESENT_STATUSES = ["P", "FN", "H"] as const;
