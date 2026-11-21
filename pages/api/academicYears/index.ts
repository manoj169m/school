import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // Handle GET request - Retrieve all academic years with pagination and optimization
    case 'GET':
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);
      
      try {
        const academicYears = await prisma.academicYear.findMany({
          skip,
          take,
          select: {
            id: true,
            startDate: true,
            endDate: true,
            label: true,
            isCurrentYear: true,
          },
          orderBy: {
            label: 'desc',
          },
        });
        res.status(200).json(academicYears);
      } catch (error) {
        console.error('Error fetching academic years:', error);
        res.status(500).json({ error: 'Error fetching academic years' });
      }
      break;

    // Handle POST request - Create a new academic year
    case 'POST':
      const { startDate, endDate, label, isCurrentYear } = req.body;
      
      try {
        // If this is set as current year, first update all existing years
        if (isCurrentYear) {
          await prisma.academicYear.updateMany({
            where: {
              isCurrentYear: true,
            },
            data: {
              isCurrentYear: false,
            },
          });
        }

        // Create the new academic year
        const newAcademicYear = await prisma.academicYear.create({
          data: {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            label,
            isCurrentYear: isCurrentYear || false,
          },
        });
        
        res.status(201).json(newAcademicYear);
      } catch (error) {
        console.error('Error creating academic year:', error);
        res.status(500).json({ error: 'Error creating academic year' });
      }
      break;

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}