import { generateId } from "../utils/id-generator";
import { generateSections } from "./sections";
import type { ClassInfo } from "../types";

const CLASS_NAMES = [
  "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th",
  "6th", "7th", "8th", "9th", "10th", "11th", "12th"
];

export const classes: ClassInfo[] = CLASS_NAMES.map((name, index) => ({
  id: generateId(),
  name,
  totalStudents: index < 2 ? 60 : index < 10 ? 75 : 65, // LKG/UKG: 60, 1-8: 75, 9-12: 65
  sections: generateSections(name, index < 10 ? 3 : 2) // 3 sections for 1-8, 2 for others
}));