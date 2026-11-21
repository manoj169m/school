export interface ExamData {
  id: number;
  name: string;
  branchId: number;
  classId: number;
  sectionId: number;
  academicYearId: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  academicYear: {
    id: number;
    label: string;
  };
  branch: {
    id: number;
    name: string;
    acronym: string;
  };
  class: {
    id: number;
    name: string;
    acronym: string;
  };
  section: {
    id: number;
    name: string;
    acronym: string;
  };
  subjects: any[];
}

// types/exam.ts

export interface ExamSubject {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
}

export interface ExamClass {
  id: number;
  name: string;
  section: string;
}

export interface Exam {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  classes: ExamClass[];
  subjects: ExamSubject[];
  status: "upcoming" | "ongoing" | "completed";
}
