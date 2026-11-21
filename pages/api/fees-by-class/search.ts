// /pages/api/fees-by-class/search.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

// Helper function to handle BigInt serialization
const serializeData = (data: unknown): unknown => {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'bigint') {
    return data.toString();
  }

  if (Array.isArray(data)) {
    return data.map(serializeData);
  }

  if (typeof data === 'object') {
    const serializedObject: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      serializedObject[key] = serializeData(value);
    }
    return serializedObject;
  }

  return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const {
    academicYearId,
    branchId,
    classIds,
    sectionIds,
    feeCategoryId
  } = req.body;

  try {
    // Validate input
    if (!academicYearId || !branchId || !classIds?.length || !sectionIds?.length || !feeCategoryId) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const feesByClass = await prisma.feeByClass.findMany({
      where: {
        academicYearId: Number(academicYearId),
        branchId: Number(branchId),
        classId: { in: classIds.map(Number) },
        sectionId: { in: sectionIds.map(Number) },
        feeCategoryId: Number(feeCategoryId),
      },
      include: {
        account: {
          select: {
            id: true,
            accountName: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        academicYear: {
          select: {
            id: true,
            label: true,
          },
        },
        feeCategory: {
          select: {
            id: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // If no records found, return 200 with empty array instead of 404
    if (!feesByClass.length) {
      return res.status(200).json([]);
    }

    // Serialize the data to handle BigInt values
    const serializedData = serializeData(feesByClass);

    return res.status(200).json(serializedData);

  } catch (error) {
    console.error('Error searching fees:', error);
    return res.status(500).json({
      error: 'Failed to search fee records'
    });
  }
}
