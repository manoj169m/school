import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { AttendanceStatus } from "@prisma/client";

interface AttendanceData {
  studentAttendance: {
    attendanceRecords: {
      date: string;
      day: string;
      status: AttendanceStatus;
      remarks?: string | null;
    }[];
    summary?: {
      totalDays: number;
      presentDays: number;
      absentDays: number;
      percentage: number;
    };
  };
  currentEnrollment: {
    academicYear: string;
    className: string;
    sectionName: string;
    branchName: string;
  };
  student: {
    // Added student details
    id: number;
    studentName: string;
    admissionNo: string | null;
    rollNo: string | null;
  };
}

export const config = {
  maxDuration: 60, // Set maximum duration to 5 minutes
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AttendanceData | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const enrollmentId = parseInt(req.query.id as string);

    if (!enrollmentId || isNaN(enrollmentId)) {
      return res.status(400).json({ error: "Invalid enrollment ID" });
    }

    // Use Promise.all to run queries concurrently
    const [enrollment, attendanceRecords] = await Promise.all([
      // Get enrollment details
      prisma.studentEnrollment.findUnique({
        where: { id: enrollmentId },
        select: {
          academicYear: { select: { label: true } },
          class: { select: { name: true } },
          section: { select: { name: true } },
          branch: { select: { name: true } },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              admissionNo: true,
              rollNo: true,
            },
          },
        },
      }),

      // Get attendance records with optimized select
      prisma.attendanceDetail.findMany({
        where: { enrollmentId },
        select: {
          status: true,
          remarks: true,
          header: {
            select: {
              date: true,
              isHoliday: true,
            },
          },
        },
        orderBy: {
          header: { date: "desc" },
        },
        take: 100, // Limit to recent 100 records for performance
      }),
    ]);

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Efficient summary calculation using reduce
    const summary = attendanceRecords.reduce(
      (acc, record) => ({
        totalDays: acc.totalDays + 1,
        presentDays: acc.presentDays + (record.status === "P" ? 1 : 0),
        absentDays: acc.absentDays + (record.status === "A" ? 1 : 0),
      }),
      { totalDays: 0, presentDays: 0, absentDays: 0 }
    );

    // Calculate percentage only once
    const percentage =
      summary.totalDays > 0
        ? Math.round((summary.presentDays / summary.totalDays) * 10000) / 100
        : 0;

    // Format records efficiently using map
    const formattedRecords = attendanceRecords.map((record) => ({
      date: record.header.date.toISOString().split("T")[0],
      day: record.header.date.toLocaleDateString("en-US", { weekday: "long" }),
      status: record.status,
      remarks: record.remarks,
    }));

    return res.status(200).json({
      studentAttendance: {
        attendanceRecords: formattedRecords,
        summary: {
          ...summary,
          percentage,
        },
      },
      currentEnrollment: {
        academicYear: enrollment.academicYear.label,
        className: enrollment.class.name,
        sectionName: enrollment.section.name,
        branchName: enrollment.branch.name,
      },
      student: {
        // Added student details
        id: enrollment.student.id,
        studentName:
          `${enrollment.student.firstName} ${enrollment.student.lastName}`.trim(),
        admissionNo: enrollment.student.admissionNo,
        rollNo: enrollment.student.rollNo,
      },
    });
  } catch (error) {
    console.error("Error fetching attendance details:", error);

    // Check if it's a timeout error
    if (error instanceof Error && error.message.includes("timeout")) {
      return res.status(504).json({
        error:
          "Request timeout - please try with a smaller date range or contact support",
      });
    }

    return res.status(500).json({
      error: "Failed to fetch attendance details",
    });
  }
}