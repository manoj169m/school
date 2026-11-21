import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'FeeByClass ID is required' });
  }

  switch (req.method) {
    // Fetch a single FeeByClass record with related data
    case 'GET': {
      try {
        const feeByClass = await prisma.feeByClass.findUnique({
          where: { id: parseInt(id as string) },
          include: {
            account: { select: { id: true, accountName: true } },
            class: { select: { id: true, name: true } },
            section: { select: { id: true, name: true } },
            branch: { select: { id: true, name: true } },
            academicYear: { select: { id: true, label: true } },
            feeCategory: { select: { id: true, category: true } },
          },
        });

        if (!feeByClass) {
          return res.status(404).json({ error: 'FeeByClass record not found' });
        }

        res.status(200).json(feeByClass);
      } catch (error) {
        console.error('Error fetching fee by class:', error);
        res.status(500).json({ error: 'Error fetching fee by class' });
      }
      break;
    }

    // Update a FeeByClass record by ID
    case 'PUT': {
      const {
        accountId,
        term,
        incomeType,
        gender,
        admissionOnly,
        daysScholarOnly,
        classId,
        sectionId,
        branchId,
        academicYearId,
        feeCategoryId,
        amount,
        dueDate,
      } = req.body;

      try {
        const updatedFeeByClass = await prisma.feeByClass.update({
          where: { id: parseInt(id as string) },
          data: {
            accountId,
            term,
            incomeType,
            gender,
            admissionOnly,
            daysScholarOnly,
            classId,
            sectionId,
            branchId,
            academicYearId,
            feeCategoryId,
            amount,
            dueDate,
          },
        });

        res.status(200).json(updatedFeeByClass);
      } catch (error) {
        console.error('Error updating fee by class:', error);
        res.status(500).json({ error: 'Error updating fee by class' });
      }
      break;
    }

    // Delete a FeeByClass record by ID
    case 'DELETE': {
      try {
        await prisma.feeByClass.delete({
          where: { id: parseInt(id as string) },
        });

        res.status(204).end();
      } catch (error) {
        console.error('Error deleting fee by class:', error);
        res.status(500).json({ error: 'Error deleting fee by class' });
      }
      break;
    }

    // Method not allowed
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
