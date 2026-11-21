// pages/api/attendance/overview.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get current academic year
    const currentAcademicYear = await prisma.academicYear.findFirst({
      where: {
        isCurrentYear: true,
      },
    });

    if (!currentAcademicYear) {
      return res.status(404).json({ error: "Current academic year not found" });
    }

    // Get today's date and format it for comparison
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );

    // Get total active students count
    const totalStudents = await prisma.studentEnrollment.count({
      where: {
        academicYearId: currentAcademicYear.id,
        status: "Active",
      },
    });

    // Get attendance headers for today with proper date range
    const attendanceHeaders = await prisma.attendanceHeader.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        academicYearId: currentAcademicYear.id,
        isHoliday: false,
      },
      include: {
        details: true,
      },
    });

    console.log("Date range:", { startOfDay, endOfDay }); // Debug log
    console.log("Found headers:", attendanceHeaders.length); // Debug log

    // Initialize counts
    const counts = {
      totalStudents,
      present: 0,
      absent: 0,
      leave: 0,
      od: 0,
    };

    // If we have headers for today
    if (attendanceHeaders.length > 0) {
      // Aggregate all details from all headers
      const allDetails = attendanceHeaders.flatMap((header) => header.details);

      // Count each status
      allDetails.forEach((detail) => {
        switch (detail.status) {
          case "P":
            counts.present += 1;
            break;
          case "A":
            counts.absent += 1;
            break;
          case "L":
            counts.leave += 1;
            break;
          case "OD":
            counts.od += 1;
            break;
        }
      });

      console.log("Total details processed:", allDetails.length); // Debug log
    } else {
      console.log("No attendance records found for today");
    }

    return res.status(200).json(counts);
  } catch (error) {
    console.error("Error in attendance overview:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
