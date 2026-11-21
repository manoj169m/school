import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

// Type definitions
interface Subject {
  id: number;
  name: string;
}

interface ExamSubject {
  id: number;
  subjectId: number;
  examId: number;
  maxMarks: number;
  minMarks: number;
  examDate: Date;
  startTime: Date;
  endTime: Date;
  duration: number;
  subject: Subject;
}

interface Branch {
  id: number;
  name: string;
}

interface Class {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
}

interface Exam {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  branchId: number;
  classId: number;
  sectionId: number;
  academicYearId: number;
  branch: Branch;
  class: Class;
  section: Section;
  subjects: ExamSubject[];
}

interface ExamUpdatePayload {
  examName: string;
  startDate: string;
  endDate: string;
  academicYearId: number;
  branchId: number[];
  classId: number[];
  sectionId: number[];
  subjects: {
    subjectId: string | number;
    examDate: string;
    startTime: string;
    endTime: string;
    duration: number;
    maxMarks: string | number;
    minMarks: string | number;
  }[];
}

interface FormattedExam {
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
  subjects: {
    id: number;
    name: string;
    examDate: string;
    startTime: string;
    endTime: string;
    duration: number;
    maxMarks: number;
    minMarks: number;
  }[];
}

// Helper function to create DateTime with proper timezone handling
const createDateTime = (dateStr: string, timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(dateStr);
  
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0,
    0
  );
};

// Helper function to format time for response
const formatTimeResponse = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

// Helper function to format exam response
const formatExamResponse = (exam: Exam): FormattedExam => ({
  id: exam.id,
  name: exam.name,
  startDate: exam.startDate.toISOString().split('T')[0],
  endDate: exam.endDate.toISOString().split('T')[0],
  branch: {
    id: exam.branchId,
    name: exam.branch.name,
  },
  class: {
    id: exam.classId,
    name: exam.class.name,
  },
  section: {
    id: exam.sectionId,
    name: exam.section.name,
  },
  subjects: exam.subjects.map(subject => ({
    id: subject.id,
    name: subject.subject.name,
    examDate: subject.examDate.toISOString().split('T')[0],
    startTime: formatTimeResponse(subject.startTime),
    endTime: formatTimeResponse(subject.endTime),
    duration: subject.duration,
    maxMarks: subject.maxMarks,
    minMarks: subject.minMarks,
  }))
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return handleGet(req, res);
    case "PUT":
      return handlePut(req, res);
    case "DELETE":
      return handleDelete(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { academicYearId, branchIds, classIds, sectionIds } = req.query;
    const examIds = req.query.id ? String(req.query.id).split(',').map(Number) : [];

    if (!examIds.length) {
      // Original behavior for when no specific exam IDs are provided
      const exams = await prisma.exam.findMany({
        where: {
          academicYearId: parseInt(academicYearId as string),
          branchId: { in: String(branchIds).split(",").map(Number) },
          classId: { in: String(classIds).split(",").map(Number) },
          sectionId: { in: String(sectionIds).split(",").map(Number) },
        },
        include: {
          branch: true,
          class: true,
          section: true,
          subjects: {
            include: {
              subject: true,
            },
          },
        },
      });

      const formattedExams = exams.map(formatExamResponse);
      return res.status(200).json(formattedExams);
    } else {
      // New behavior for fetching multiple specific exams
      const exams = await prisma.exam.findMany({
        where: {
          id: { in: examIds },
          academicYearId: parseInt(academicYearId as string),
          branchId: { in: String(branchIds).split(",").map(Number) },
          classId: { in: String(classIds).split(",").map(Number) },
          sectionId: { in: String(sectionIds).split(",").map(Number) },
        },
        include: {
          branch: true,
          class: true,
          section: true,
          subjects: {
            include: {
              subject: true,
            },
          },
        },
      });

      if (!exams.length) {
        return res.status(404).json({ error: "No exams found with the specified IDs" });
      }

      const formattedExams = exams.map(formatExamResponse);
      return res.status(200).json(formattedExams);
    }
  } catch (error) {
    console.error("Error fetching exams:", error);
    return res.status(500).json({ error: "Failed to fetch exams" });
  }
}

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const { exam } = req.body as { exam: ExamUpdatePayload };

    await prisma.examSubject.deleteMany({
      where: { examId: parseInt(id as string) },
    });

    const updatedExam = await prisma.exam.update({
      where: { id: parseInt(id as string) },
      data: {
        name: exam.examName,
        startDate: new Date(exam.startDate),
        endDate: new Date(exam.endDate),
        academicYearId: exam.academicYearId,
        branchId: exam.branchId[0],
        classId: exam.classId[0],
        sectionId: exam.sectionId[0],
        subjects: {
          create: exam.subjects.map(subject => ({
            subjectId: parseInt(subject.subjectId.toString()),
            examDate: new Date(subject.examDate),
            startTime: createDateTime(subject.examDate, subject.startTime),
            endTime: createDateTime(subject.examDate, subject.endTime),
            duration: subject.duration,
            maxMarks: parseFloat(subject.maxMarks.toString()),
            minMarks: parseFloat(subject.minMarks.toString()),
          })),
        },
      },
      include: {
        branch: true,
        class: true,
        section: true,
        subjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    const formattedExam = formatExamResponse(updatedExam);
    return res.status(200).json(formattedExam);
  } catch (error) {
    console.error("Error updating exam:", error);
    return res.status(500).json({ error: "Failed to update exam" });
  }
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;

    await prisma.examSubject.deleteMany({
      where: { examId: parseInt(id as string) },
    });

    await prisma.exam.delete({
      where: { id: parseInt(id as string) },
    });

    return res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error("Error deleting exam:", error);
    return res.status(500).json({ error: "Failed to delete exam" });
  }
}