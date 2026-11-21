import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { academicYearId, branchId, classId, sectionId, monthYear } = req.body;

    // Get the start and end of the month
    const startDate = new Date(monthYear);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    // Define the types for the data
    // interface AttendanceDetail {
    //   enrollmentId: number;
    //   status: string;
    //   remarks: string | null;
    // }

    // interface AttendanceHeader {
    //   date: Date;
    //   totalPresent: number;
    //   totalAbsent: number;
    //   totalStudents: number;
    //   isHoliday: boolean;
    //   details: AttendanceDetail[];
    // }

    // Fetch all attendance records for the month
    const monthlyAttendance = await prisma.attendanceHeader.findMany({
      where: {
        academicYearId,
        branchId,
        classId,
        sectionId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        details: true,
      },
    });

    // Create compressed JSON data
    const compressedData = {
      headers: monthlyAttendance.map((header) => ({
        date: header.date,
        totalPresent: header.totalPresent,
        totalAbsent: header.totalAbsent,
        totalStudents: header.totalStudents,
        isHoliday: header.isHoliday,
        details: header.details.map((detail) => ({
          enrollmentId: detail.enrollmentId,
          status: detail.status,
          remarks: detail.remarks,
        })),
      })),
    };

    // Create archive record
    await prisma.$transaction(async (tx) => {
      // Create archive entry
      await tx.attendanceArchive.create({
        data: {
          academicYearId,
          branchId,
          classId,
          sectionId,
          monthYear: startDate,
          attendanceData: compressedData,
        },
      });

      // Optionally, delete the original records
      // Comment this out if you want to keep the original records
      await tx.attendanceDetail.deleteMany({
        where: {
          header: {
            academicYearId,
            branchId,
            classId,
            sectionId,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      });

      await tx.attendanceHeader.deleteMany({
        where: {
          academicYearId,
          branchId,
          classId,
          sectionId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
    });

    return res.status(200).json({
      message: 'Attendance data archived successfully',
    });
  } catch (error) {
    console.error('Error archiving attendance:', error);
    return res.status(500).json({
      message: 'Failed to archive attendance data',
    });
  }
}
