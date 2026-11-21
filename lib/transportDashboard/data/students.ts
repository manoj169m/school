import { generateId } from "../utils/id-generator";
import { getTransportType, getBusNumber } from "../utils/transport-utils";
import type { Student } from "../types";

export function generateStudents(className: string, section: string, count: number): Student[] {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    rollNo: `${className}${section}${(i + 1).toString().padStart(2, '0')}`,
    name: `Student ${i + 1}`,
    fatherContact: `555-${(1000 + i).toString().padStart(4, '0')}`,
    transportType: getTransportType(i),
    busNo: getBusNumber(i)
  }));
}