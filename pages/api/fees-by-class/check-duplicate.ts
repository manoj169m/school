// /pages/api/fees-by-class/check-duplicate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const {
      accountId,
      term,
      classId,
      sectionId,
      branchId,
      academicYearId,
      feeCategoryId
    } = req.body;

    // Validate required fields
    if (!accountId || !term || !classId || !sectionId || !branchId || !academicYearId || !feeCategoryId) {
      return res.status(400).json({
        error: 'Missing required fields',
        code: 'VALIDATION_ERROR'
      });
    }

    // Check for existing fee entry
    const existingFee = await prisma.feeByClass.findFirst({
      where: {
        accountId: Number(accountId),
        term: Number(term),
        classId: Number(classId),
        sectionId: Number(sectionId),
        branchId: Number(branchId),
        academicYearId: Number(academicYearId),
        feeCategoryId: Number(feeCategoryId),
      },
      include: {
        class: {
          select: { name: true }
        },
        section: {
          select: { name: true }
        }
      }
    });

    if (existingFee) {
      return res.status(409).json({
        duplicate: true,
        details: {
          className: existingFee.class.name,
          sectionName: existingFee.section.name,
          term: existingFee.term
        },
        code: 'P2002'
      });
    }

    return res.status(200).json({
      duplicate: false
    });

  } catch (error) {
    console.error('Error checking duplicate fee:', error);
    return res.status(500).json({
      error: 'Failed to check for duplicate fee',
      code: 'INTERNAL_ERROR'
    });
  }
}