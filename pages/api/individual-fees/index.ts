// pages/api/individual-fees.ts
import { NextApiRequest, NextApiResponse } from 'next';
import  prisma  from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      studentFeeId,
      academicYearId,
      branchId,
      classId,
      sectionId,
      accountId,
      term,
      customAmount,
      description,
    } = req.body;

    // Validate required fields
    if (!studentFeeId || !academicYearId || !branchId || !classId || !sectionId || !accountId || !term || !customAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new individual fee
    const individualFee = await prisma.individualFee.create({
      data: {
        studentFeeId,
        academicYearId,
        branchId,
        classId,
        sectionId,
        accountId,
        term,
        customAmount,
        description,
      },
    });

    return res.status(201).json(individualFee);
  } catch (error) {
    console.error('Failed to create individual fee:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}