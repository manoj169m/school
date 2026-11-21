import type { Student } from "../types";

export const TRANSPORT_TYPES = ["pickup", "drop", "both", "none"] as const;
export type TransportType = typeof TRANSPORT_TYPES[number];

export function getTransportType(index: number): TransportType {
  return TRANSPORT_TYPES[index % TRANSPORT_TYPES.length];
}

export function getBusNumber(index: number): string {
  return `SCH-00${(index % 5) + 1}`;
}

export function countTransportStudents(students: Student[]): number {
  return students.filter(s => s.transportType !== "none").length;
}