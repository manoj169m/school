import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string' || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const academicYear = await prisma.academicYear.findUnique({
          where: {
            id: Number(id),
          },
        });

        if (!academicYear) {
          return res.status(404).json({ error: 'Academic Year not found' });
        }

        res.status(200).json(academicYear);
      } catch (error) {
        console.error('Error fetching academic year:', error);
        res.status(500).json({ error: 'Error fetching academic year' });
      }
      break;

    case 'PUT':
      const { startDate, endDate, label, isCurrentYear } = req.body;

      try {
        // Start a transaction to handle potential current year updates
        const result = await prisma.$transaction(async (prisma) => {
          // If setting as current year, first update all other years to false
          if (isCurrentYear) {
            await prisma.academicYear.updateMany({
              where: {
                id: {
                  not: Number(id)
                },
                isCurrentYear: true
              },
              data: {
                isCurrentYear: false
              }
            });
          }

          // Update the specified academic year
          const updatedAcademicYear = await prisma.academicYear.update({
            where: {
              id: Number(id),
            },
            data: {
              startDate: new Date(startDate),
              endDate: new Date(endDate),
              label,
              isCurrentYear: isCurrentYear || false,
            },
          });

          return updatedAcademicYear;
        });

        res.status(200).json(result);
      } catch (error) {
        console.error('Error updating academic year:', error);
        res.status(500).json({ error: 'Error updating academic year' });
      }
      break;

    case 'DELETE':
      try {
        const academicYear = await prisma.academicYear.findUnique({
          where: {
            id: Number(id),
          },
          select: {
            isCurrentYear: true
          }
        });

        if (academicYear?.isCurrentYear) {
          return res.status(400).json({ 
            error: 'Cannot delete the current academic year. Please set another year as current first.' 
          });
        }

        const deletedAcademicYear = await prisma.academicYear.delete({
          where: {
            id: Number(id),
          },
        });

        res.status(200).json({ 
          message: 'Academic Year deleted', 
          academicYear: deletedAcademicYear 
        });
      } catch (error) {
        console.error('Error deleting academic year:', error);
        res.status(500).json({ error: 'Error deleting academic year' });
      }
      break;

    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}