import type {  Section } from "../types";

export function getClassDisplayName(name: string): string {
  return name.endsWith('th') || name.endsWith('st') || name.endsWith('nd') || name.endsWith('rd') 
    ? `${name} Standard` 
    : `${name} Class`;
}

export function getSectionDisplayName(className: string, sectionName: string): string {
  return `${className} - Section ${sectionName}`;
}

export function getStudentCount(sections: Section[]): number {
  return sections.reduce((total, section) => total + section.students.length, 0);
}