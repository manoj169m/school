import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      academicYearId,
      branchIds,
      classIds,
      sectionIds,
      feeCategoryIds,
    } = req.query;

    // Validate required parameters
    if (!academicYearId || !branchIds || !classIds || !sectionIds || !feeCategoryIds) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Convert string arrays to number arrays
    const branches = Array.isArray(branchIds) ? branchIds.map(Number) : [Number(branchIds)];
    const classes = Array.isArray(classIds) ? classIds.map(Number) : [Number(classIds)];
    const sections = Array.isArray(sectionIds) ? sectionIds.map(Number) : [Number(sectionIds)];
    const categories = Array.isArray(feeCategoryIds) ? feeCategoryIds.map(Number) : [Number(feeCategoryIds)];

    const feeStructure = await prisma.feeByClass.findMany({
      where: {
        academicYearId: Number(academicYearId),
        branchId: { in: branches },
        classId: { in: classes },
        sectionId: { in: sections },
        feeCategoryId: { in: categories },
      },
      include: {
        account: {
          select: {
            accountName: true,
          },
        },
        branch: {
          select: {
            name: true,
          },
        },
        class: {
          select: {
            name: true,
          },
        },
        section: {
          select: {
            name: true,
        },
        },
        feeCategory: {
          select: {
            category: true,
          },
        },
        academicYear: {
          select: {
            label: true,
          },
        },
      },
      orderBy: [
        { branchId: 'asc' },
        { classId: 'asc' },
        { sectionId: 'asc' },
        { term: 'asc' },
      ],
    });

    return res.status(200).json(feeStructure);
  } catch (error) {
    console.error('Error fetching fee structure:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}