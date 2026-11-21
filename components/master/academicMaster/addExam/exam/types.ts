import { z } from "zod";
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const nonNegativeString = z.string().refine(
  (val) => !isNaN(Number(val)) && Number(val) >= 0,
  { message: "Value must be a non-negative number" }
);

export const ExamValidation = z.object({
  examName: z.string().nonempty({ message: "Exam Name is required" }),
  numberOfSubjects: z.number().int().positive(),
  startDate: z.date(),
  endDate: z.date(),
  branchId: z.array(z.number().int().positive()).min(1),
  classId: z.array(z.number().int().positive()).min(1),
  sectionId: z.array(z.number().int().positive()).min(1),
  academicYearId: z.number().int().positive(),
  subjects: z.array(
    z.object({
      subjectId: z.string().nonempty(),
      startTime: z.string().regex(timeRegex),
      endTime: z.string().regex(timeRegex),
      duration: z.number().min(1),
      maxMarks: nonNegativeString,
      minMarks: nonNegativeString,
      examDate: z.date(),
    })
  ).min(1),
}).refine(
  (data) => {
    return data.startDate <= data.endDate;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
).refine(
  (data) => {
    return data.subjects.every(
      (subject) => parseFloat(subject.minMarks) <= parseFloat(subject.maxMarks)
    );
  },
  {
    message: "Minimum marks must be less than or equal to maximum marks",
    path: ["subjects"],
  }
).refine(
  (data) => {
    return data.subjects.every((subject) => {
      const examDate = new Date(subject.examDate);
      return examDate >= data.startDate && examDate <= data.endDate;
    });
  },
  {
    message: "Exam dates must be within registration period",
    path: ["subjects"],
  }
);

export type ExamCreationFormValues = z.infer<typeof ExamValidation>;


  interface ExamSubject {
    id: number;
    name: string;
    examDate: string;
    startTime: string;
    endTime: string;
    duration: number;    // Added this
    maxMarks: number;    // Added this
    minMarks: number; 

  }

  export interface Exam {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    branch: {
      id: number;
      name: string;
    };
    class: {
      id: number;
      name: string;
    };
    section: {
      id: number;
      name: string;
    };
    subjects: ExamSubject[];
  }

