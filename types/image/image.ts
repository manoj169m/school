// types/image/image.ts

export interface Student {
  enrollmentId: number;
  id: number;
  firstName: string;
  lastName: string;
  admissionNo: string;
  rollNo: string;
  branchId: number;
  branchName: string;
  classId: number;
  className: string;
  sectionId: number;
  sectionName: string;
  enrollmentStatus: string;
  imageUrl?: string;
}

export interface FormValues {
  academicYearId: string;
  branchIds: string[];
  classIds: string[];
  sectionIds: string[];
}

export interface ImageFormValues {
  academicYear: string;
  branches: string[];
  classes: string[];
  sections: string[];
}

export interface StudentCardProps {
  student: Student;
  onImageUpdate: (studentId: number, imageUrl: string) => void;
}