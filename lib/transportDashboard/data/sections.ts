import { generateId } from "../utils/id-generator";
import { generateStudents } from "./students";
import type { Section } from "../types";

export function generateSections(className: string, numSections: number): Section[] {
  return Array.from({ length: numSections }, (_, i) => ({
    id: generateId(),
    name: String.fromCharCode(65 + i), // A, B, C, etc.
    students: generateStudents(className, String.fromCharCode(65 + i), 8)
  }));
}