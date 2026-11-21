// pages/api/exams/upcoming.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get current academic year
    const currentAcademicYear = await prisma.academicYear.findFirst({
      where: {
        isCurrentYear: true,
      },
    });

    if (!currentAcademicYear) {
      return res.status(404).json({ error: "No current academic year found" });
    }

    const today = new Date();

    // Fetch upcoming exams
    const upcomingExams = await prisma.exam.findMany({
      where: {
        academicYearId: currentAcademicYear.id,
        endDate: {
          gte: today,
        },
      },
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
        class: true,
        section: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    // Format exam data
    const formattedExams = upcomingExams.map((exam) => ({
      id: exam.id.toString(),
      name: exam.name,
      startDate: exam.startDate.toISOString(),
      endDate: exam.endDate.toISOString(),
      classes: [
        {
          id: exam.classId,
          name: exam.class.name,
          section: exam.section.name,
        },
      ],
      subjects: exam.subjects.map((sub) => ({
        id: sub.id.toString(),
        name: sub.subject.name,
        date: sub.examDate.toISOString(),
        startTime: sub.startTime.toLocaleTimeString(),
        endTime: sub.endTime.toLocaleTimeString(),
        duration: `${sub.duration} minutes`,
        maxMarks: sub.maxMarks,
        minMarks: sub.minMarks,
      })),
      status: determineExamStatus(today, exam.startDate, exam.endDate),
    }));

    return res.status(200).json(formattedExams);
  } catch (error) {
    console.error("Error fetching upcoming exams:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Helper function to determine exam status
function determineExamStatus(
  today: Date,
  startDate: Date,
  endDate: Date
): "upcoming" | "ongoing" | "completed" {
  if (today < startDate) {
    return "upcoming";
  } else if (today > endDate) {
    return "completed";
  } else {
    return "ongoing";
  }
}
