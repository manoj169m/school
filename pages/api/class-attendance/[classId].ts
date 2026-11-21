import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const classId = parseInt(req.query.classId as string);
  const branchId = parseInt(req.query.branchId as string);
  const academicYearId = parseInt(req.query.academicYearId as string);
  const date = new Date(req.query.date as string);

  if (!classId || !branchId || !academicYearId || !date) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    // Get all sections for this class
    const sections = await prisma.branchClassSection.findMany({
      where: {
        classId: classId,
        branchId: branchId,
        academicYearId: academicYearId,
      },
      include: {
        section: true,
      },
    });

    // Get attendance data for each section
    const sectionAttendance = await Promise.all(
      sections.map(async (section) => {
        const header = await prisma.attendanceHeader.findUnique({
          where: {
            unique_daily_class_attendance: {
              date: date,
              branchId: branchId,
              classId: classId,
              sectionId: section.sectionId,
            },
          },
          include: {
            details: true,
          },
        });

        const totalStudents = await prisma.studentEnrollment.count({
          where: {
            academicYearId: academicYearId,
            branchId: branchId,
            classId: classId,
            sectionId: section.sectionId,
            status: "Active",
          },
        });

        // If no attendance header exists or no details, return not posted status
        if (!header || header.details.length === 0) {
          return {
            sectionId: section.sectionId,
            sectionName: section.section.name,
            total: totalStudents,
            present: 0,
            absent: 0,
            leave: 0,
            morningPresent: 0,
            afternoonPresent: 0,
            onDuty: 0,
            isPosted: false,
          };
        }

        const attendanceStats = header.details.reduce(
          (acc, detail) => {
            switch (detail.status) {
              case "P":
                acc.present++;
                break;
              case "A":
                acc.absent++;
                break;
              case "L":
                acc.leave++;
                break;
              case "FN":
                acc.morningPresent++;
                break;
              case "AN":
                acc.afternoonPresent++;
                break;
              case "OD":
                acc.onDuty++;
                break;
            }
            return acc;
          },
          {
            present: 0,
            absent: 0,
            leave: 0,
            morningPresent: 0,
            afternoonPresent: 0,
            onDuty: 0,
          }
        );

        // Check if any attendance was recorded
        const isPosted = Object.values(attendanceStats).some(
          (value) => value > 0
        );

        return {
          sectionId: section.sectionId,
          sectionName: section.section.name,
          total: totalStudents,
          ...attendanceStats,
          isPosted,
        };
      })
    );

    return res.status(200).json(sectionAttendance);
  } catch (error) {
    console.error("Error fetching class attendance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
