import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { AttendanceStatus } from '@prisma/client';

interface AttendanceRecord {
  enrollmentId: number;
  status: AttendanceStatus;
  branchId: number;
  classId: number;
  sectionId: number;
  remarks?: string;
}

interface AttendanceSubmission {
  academicYearId: number;
  branchIds: number[];
  classIds: number[];
  sectionIds: number[];
  date: string;
  attendanceRecords: AttendanceRecord[];
  forceUpdate?: boolean;
}

const normalizeToMidnight = (dateString: string): Date => {
  const dateOnly = dateString.split('T')[0];
  return new Date(`${dateOnly}T00:00:00.000Z`);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await prisma.$transaction(async (prisma) => {
    try {
      const submission: AttendanceSubmission = req.body;
      const normalizedDate = normalizeToMidnight(submission.date);
      
      // Group attendance records by branch, class, and section
      const groupedRecords = submission.attendanceRecords.reduce((acc, record) => {
        const key = `${record.branchId}-${record.classId}-${record.sectionId}`;
        if (!acc[key]) {
          acc[key] = {
            branchId: record.branchId,
            classId: record.classId,
            sectionId: record.sectionId,
            records: []
          };
        }
        acc[key].records.push(record);
        return acc;
      }, {} as Record<string, {
        branchId: number;
        classId: number;
        sectionId: number;
        records: AttendanceRecord[];
      }>);

      // Process each group within the transaction
      const results = await Promise.all(
        Object.values(groupedRecords).map(async (group) => {
          const { branchId, classId, sectionId, records } = group;

          // Calculate statistics
          const totalStudents = records.length;
          const totalPresent = records.filter(r => r.status === 'P').length;
          const totalAbsent = records.filter(r => r.status === 'A').length;

          // Find or create header
          const header = await prisma.attendanceHeader.upsert({
            where: {
              unique_daily_class_attendance: {
                date: normalizedDate,
                branchId,
                classId,
                sectionId
              }
            },
            create: {
              date: normalizedDate,
              academicYearId: submission.academicYearId,
              branchId,
              classId,
              sectionId,
              totalPresent,
              totalAbsent,
              totalStudents,
              createdBy: 1, // Replace with actual user ID
              updatedBy: 1
            },
            update: {
              totalPresent,
              totalAbsent,
              totalStudents,
              updatedBy: 1
            }
          });

          // Update attendance details
          await Promise.all(
            records.map(record =>
              prisma.attendanceDetail.upsert({
                where: {
                  unique_student_daily_attendance: {
                    attendanceHeaderId: header.id,
                    enrollmentId: record.enrollmentId
                  }
                },
                create: {
                  attendanceHeaderId: header.id,
                  enrollmentId: record.enrollmentId,
                  status: record.status,
                  remarks: record.remarks
                },
                update: {
                  status: record.status,
                  remarks: record.remarks
                }
              })
            )
          );

          return {
            branchId,
            classId,
            sectionId,
            totalStudents,
            totalPresent,
            totalAbsent,
            date: normalizedDate
          };
        })
      );

      return results;
    } catch (error) {
      throw error;
    }
  });

  return res.status(200).json({
    message: 'Attendance submitted successfully',
    results: session
  });
}