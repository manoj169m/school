interface Grade {
  id: number;
  minMarks: number;
  maxMarks: number;
  grade: string;
  description: string | null;
}

interface Student {
  id: number;
  enrollmentId: number;
  firstName: string;
  lastName: string;
  rollNo: string;
  admissionNo: string;
  branchId: number;
  branchName: string;
  classId: number;
  className: string;
  sectionId: number;
  sectionName: string;
  status: string;
  remarks: string;
}

interface ExamResultSubmission {
  examId: number;
  enrollmentId: number;
  classId: number;
  sectionId: number;
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  isPass: boolean;
  grade: string | null;
  rank: number | null;
  subjectResults: {
    examSubjectId: number;
    enrollmentId: number;
    marksObtained: number;
    isPass: boolean;
  }[];
}

interface ExamResult {
  id?: number;
  examId: number;
  enrollmentId: number;
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  isPass: boolean;
  grade?: string;
  rank?: number | null;
  subjectResults: {
    examSubjectId: number;
    marksObtained: number;
    isPass: boolean;
    examResultId?: number;
  }[];
  exam?: {
    id: number;
    academicYearId: number;
    branchId: number;
    classId: number;
    sectionId: number;
  };
}

interface ExamSubject {
  id: number;
  subjectId: number;
  maxMarks: number;
  minMarks: number;
  name: string;
  subject: {
    id: number;
  };
}

interface ExamData {
  id: number;
  name: string;
  branch: {
    id: number;
  };
  class: {
    id: number;
  };
  section: {
    id: number;
  };
  subjects: ExamSubject[];
}

interface ResultEntry {
  marks: number;
  isValid: boolean;
}

interface ResultState {
  [key: string]: ResultEntry;
}

interface StudentResult {
  studentId: number;
  enrollmentId: number;
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  grade: string;
  isValid: boolean;
  hasMarks: boolean;
  isPass: boolean;
  rank?: number;
  subjectResults: {
    [key: string]: {
      marks: number;
      isPass: boolean;
    };
  };
}

interface StudentResultTableProps {
  academicYear: string;
  branches: string[];
  classes: string[];
  sections: string[];
  examId: string;
  matchedExamIds: number[];
}

