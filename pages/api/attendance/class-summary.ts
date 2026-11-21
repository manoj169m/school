import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { academicYearId, branchId, classId, sectionId, monthYear } = req.query;

    const archive = await prisma.attendanceArchive.findFirst({
      where: {
        academicYearId: Number(academicYearId),
        branchId: Number(branchId),
        classId: Number(classId),
        sectionId: Number(sectionId),
        monthYear: new Date(monthYear as string)
      }
    });

    if (!archive) {
      return res.status(404).json({
        message: 'No archived data found for the specified month'
      });
    }

    return res.status(200).json({
      data: archive.attendanceData,
      archivedAt: archive.archivedAt
    });

  } catch (error) {
    console.error('Error retrieving archived attendance:', error);
    return res.status(500).json({
      message: 'Failed to retrieve archived attendance data'
    });
  }
}