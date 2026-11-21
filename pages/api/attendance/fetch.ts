import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { normalizeDate } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const { academicYearId, branchIds, classIds, sectionIds, date } = req.query;

    if (!academicYearId || !branchIds || !classIds || !sectionIds || !date) {
      return res.status(400).json({
        message: 'Missing required parameters'
      });
    }

    const searchDate = normalizeDate(date as string);
    const numericAcademicYearId = Number(academicYearId);
    const numericBranchIds = Array.isArray(branchIds) ? branchIds.map(Number) : [Number(branchIds)];
    const numericClassIds = Array.isArray(classIds) ? classIds.map(Number) : [Number(classIds)];
    const numericSectionIds = Array.isArray(sectionIds) ? sectionIds.map(Number) : [Number(sectionIds)];

    // Fetch existing attendance records with all necessary relations
    const existingRecords = await prisma.attendanceHeader.findMany({
      where: {
        academicYearId: numericAcademicYearId,
        branchId: { in: numericBranchIds },
        classId: { in: numericClassIds },
        sectionId: { in: numericSectionIds },
        date: searchDate,
      },
      include: {
        details: {
          include: {
            enrollment: {
              include: {
                student: true,
                branch: true,
                class: true,
                section: true
              }
            }
          }
        }
      }
    });

    // Transform the records into the expected format
    const formattedRecords = existingRecords.flatMap(header => 
      header.details.map(detail => ({
        id: detail.enrollment.student.id,
        enrollmentId: detail.enrollmentId,
        firstName: detail.enrollment.student.firstName,
        lastName: detail.enrollment.student.lastName,
        branchId: header.branchId,
        branchName: detail.enrollment.branch.name,
        classId: header.classId,
        className: detail.enrollment.class.name,
        sectionId: header.sectionId,
        sectionName: detail.enrollment.section.name,
        status: detail.status,
        remarks: detail.remarks || '',
        admissionNo: detail.enrollment.student.admissionNo,
        rollNo: detail.enrollment.student.rollNo || ''
      }))
    );

    return res.status(200).json(formattedRecords);

  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Failed to fetch attendance'
    });
  }
}