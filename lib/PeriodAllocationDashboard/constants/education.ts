export const STANDARDS = [
  "LKG",
  "UKG",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
] as const;

export const SECTIONS = ["A", "B", "C", "D"] as const;

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

export const SUBJECTS = [
  "Language",
  "English",
  "Mathematics",
  "Science",
  "Social Science",
  "Physical Training",
  "Drawing",
  "Computer Science",
  "Music",
  "Library",
] as const;

export type Standard = (typeof STANDARDS)[number];
export type Section = (typeof SECTIONS)[number];
export type Day = (typeof DAYS)[number];
export type Subject = (typeof SUBJECTS)[number];

export interface TimeTablePeriod {
  number: number;
  time: string;
  subject: Subject;
  teacher: string;
  room: string;
}

export const TIME_SLOTS = [
  "8:00 - 8:45",
  "8:45 - 9:30",
  "9:30 - 10:15",
  "10:15 - 11:00",
  "11:15 - 12:00", // After short break
  "12:00 - 12:45",
  "12:45 - 1:30",
  "2:15 - 3:00", // After lunch break
  "3:00 - 3:45",
  "3:45 - 4:30",
] as const;
