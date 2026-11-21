import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { FeeGenderType } from '@prisma/client';

interface FeeEntry {
  accountId: number;
  term: number;
  classId: number;
  sectionId: number;
  branchId: number;
  academicYearId: number;
  feeCategoryId: number;
  incomeType: string;
  gender: FeeGenderType;
  admissionOnly: boolean;
  daysScholarOnly: boolean;
  amount: number;
  dueDate: Date;
}

interface DuplicateCheckInput {
  accountId: number;
  term: number;
  classId: number;
  sectionId: number;
  branchId: number;
  academicYearId: number;
  feeCategoryId: number;
}

async function checkDuplicateFeesInBatch(inputs: DuplicateCheckInput[]) {
  const existingFees = await prisma.feeByClass.findMany({
    where: {
      OR: inputs.map(input => ({
        AND: {
          accountId: input.accountId,
          term: input.term,
          classId: input.classId,
          sectionId: input.sectionId,
          branchId: input.branchId,
          academicYearId: input.academicYearId,
          feeCategoryId: input.feeCategoryId,
        }
      }))
    },
    include: {
      class: { select: { name: true } },
      section: { select: { name: true } }
    }
  });

  return existingFees.map(fee => ({
    classId: fee.classId,
    sectionId: fee.sectionId,
    className: fee.class.name,
    sectionName: fee.section.name,
    term: fee.term
  }));
}

async function createFeesInBatch(feeEntries: FeeEntry[]) {
  return await prisma.$transaction(
    feeEntries.map(entry => 
      prisma.feeByClass.create({
        data: {
          accountId: entry.accountId,
          term: entry.term,
          classId: entry.classId,
          sectionId: entry.sectionId,
          branchId: entry.branchId,
          academicYearId: entry.academicYearId,
          feeCategoryId: entry.feeCategoryId,
          incomeType: entry.incomeType,
          gender: entry.gender,
          admissionOnly: entry.admissionOnly,
          daysScholarOnly: entry.daysScholarOnly,
          amount: entry.amount,
          dueDate: entry.dueDate
        },
        include: {
          class: { select: { name: true } },
          section: { select: { name: true } }
        }
      })
    )
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const input = req.body as {
        accountId: number;
        term: number;
        classIds: number[];
        sectionIds: number[];
        branchId: number;
        academicYearId: number;
        feeCategoryId: number;
        incomeType: string;
        gender: FeeGenderType;
        admissionOnly: boolean;
        daysScholarOnly: boolean;
        amount: number;
        dueDate: string;
      };
      
      // Prepare all combinations for duplicate checking
      const combinationsToCheck: DuplicateCheckInput[] = [];
      for (const classId of input.classIds) {
        for (const sectionId of input.sectionIds) {
          combinationsToCheck.push({
            accountId: input.accountId,
            term: input.term,
            classId,
            sectionId,
            branchId: input.branchId,
            academicYearId: input.academicYearId,
            feeCategoryId: input.feeCategoryId
          });
        }
      }

      // Check duplicates in batch
      const duplicateFees = await checkDuplicateFeesInBatch(combinationsToCheck);

      if (duplicateFees.length > 0) {
        return res.status(409).json({
          error: 'Duplicate fees found',
          duplicates: duplicateFees,
          code: 'DUPLICATE_FEES'
        });
      }

      // Prepare fee entries for batch creation
      const feeEntries: FeeEntry[] = combinationsToCheck.map(combo => ({
        ...combo,
        incomeType: input.incomeType,
        gender: input.gender,
        admissionOnly: input.admissionOnly,
        daysScholarOnly: input.daysScholarOnly,
        amount: input.amount,
        dueDate: new Date(input.dueDate)
      }));

      // Create all fees in a single transaction
      const createdFees = await createFeesInBatch(feeEntries);

      return res.status(201).json({
        success: true,
        message: 'Fee entries created successfully',
        data: createdFees.map(fee => ({
          id: fee.id,
          classId: fee.classId,
          sectionId: fee.sectionId,
          term: fee.term,
          amount: fee.amount,
          className: fee.class.name,
          sectionName: fee.section.name
        }))
      });

    } catch (error) {
      console.error('Error creating fees:', error);
      return res.status(500).json({
        error: 'Failed to create fee entries',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}