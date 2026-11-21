import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const { academicYearId, branchIds, classIds, sectionIds } = req.query;

    // Parse array parameters
    const branches = Array.isArray(branchIds) ? branchIds : [branchIds];
    const classes = Array.isArray(classIds) ? classIds : [classIds];
    const sections = Array.isArray(sectionIds) ? sectionIds : [sectionIds];

    const activeStudents = await prisma.studentEnrollment.findMany({
      where: {
        academicYearId: Number(academicYearId),
        branchId: { in: branches.map(id => Number(id)) },
        classId: { in: classes.map(id => Number(id)) },
        sectionId: { in: sections.map(id => Number(id)) },
        status: 'Active',
      },
      select: {
        id: true,
        status: true,
        branchId: true,
        branch: {
          select: {
            id: true,
            acronym: true
          }
        },
        class: {
          select: {
            id: true,
            name: true
          }
        },
        section: {
          select: {
            id: true,
            name: true
          }
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNo: true,
            rollNo: true,
          }
        }
      }
    });

    const formattedStudents = activeStudents.map(enrollment => ({
      enrollmentId: enrollment.id,
      ...enrollment.student,
      branchId: enrollment.branchId,
      branchName: enrollment.branch.acronym,
      classId: enrollment.class.id,
      className: enrollment.class.name,
      sectionId: enrollment.section.id,
      sectionName: enrollment.section.name,
      enrollmentStatus: enrollment.status
    }));

    res.status(200).json(formattedStudents);
  } catch (error) {
    console.error('Error fetching active students:', error);
    res.status(500).json({ error: 'Failed to fetch active students' });
  }
}