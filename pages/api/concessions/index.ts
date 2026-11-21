import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

interface ConcessionInput {
  accountId: number;
  term: number;
  amount: number;
  description?: string;
}

interface CreateConcessionRequest {
  studentFeeId: number;
  academicYearId: number;
  branchId: number;
  classId: number;
  sectionId: number;
  concessionCategoryId: number;
  concessions: ConcessionInput[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const {
        studentFeeId,
        academicYearId,
        branchId,
        classId,
        sectionId,
        concessionCategoryId,
        concessions
      } = req.body as CreateConcessionRequest;

      // Validate required numeric fields
      if (!studentFeeId || !academicYearId || !branchId || !classId || !sectionId || !concessionCategoryId) {
        return res.status(400).json({ 
          error: 'Missing or invalid required fields. All IDs must be numbers.' 
        });
      }

      // Create concessions for each fee type
      const createdConcessions = await Promise.all(
        concessions
          .filter((concession) => concession.amount > 0)
          .map(async (concession) => {
            return prisma.concession.create({
              data: {
                studentFeeId: Number(studentFeeId),
                academicYearId: Number(academicYearId),
                branchId: Number(branchId),
                classId: Number(classId),
                sectionId: Number(sectionId),
                concessionCategoryId: Number(concessionCategoryId),
                accountId: Number(concession.accountId),
                term: Number(concession.term),
                amount: Number(concession.amount),
                description: concession.description || null
              }
            });
          })
      );

      return res.status(200).json(createdConcessions);
    } catch (error) {
      console.error('Error creating concessions:', error);
      return res.status(500).json({ 
        error: 'Failed to create concessions',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}