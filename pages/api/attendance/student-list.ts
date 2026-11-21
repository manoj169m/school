// pages/api/attendance/student-list.ts
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { branchId, academicYearId, classId, sectionId, type, date } =
    req.query;

  if (
    !branchId ||
    !academicYearId ||
    !classId ||
    !sectionId ||
    !type ||
    !date
  ) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    // First get the attendance header
    const header = await prisma.attendanceHeader.findUnique({
      where: {
        unique_daily_class_attendance: {
          date: new Date(date as string),
          branchId: parseInt(branchId as string),
          classId: parseInt(classId as string),
          sectionId: parseInt(sectionId as string),
        },
      },
      include: {
        details: {
          where: {
            status:
              type === "morning"
                ? "FN"
                : type === "afternoon"
                ? "AN"
                : type === "present"
                ? "P"
                : type === "absent"
                ? "A"
                : type === "leave"
                ? "L"
                : type === "onDuty"
                ? "OD"
                : undefined,
          },
          include: {
            enrollment: {
              include: {
                student: {
                  select: {
                    firstName: true,
                    lastName: true,
                    rollNo: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!header) {
      return res.status(404).json({
        message: "No attendance record found for this date",
      });
    }

    const students = header.details.map((detail) => ({
      name: `${detail.enrollment.student.firstName} ${detail.enrollment.student.lastName}`,
      rollNo: detail.enrollment.student.rollNo || "N/A",
      enrollmentId: detail.enrollmentId,
    }));

    return res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching student list:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
