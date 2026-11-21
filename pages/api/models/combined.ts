import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Ensure this points to your Prisma client setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      try {
        // Fetch data from Class
        const classes = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
          },
        });

        // Fetch data from Section
        const sections = await prisma.section.findMany({
          select: {
            id: true,
            name: true,
          },
        });

        // Fetch data from AcademicYear
        const academicYears = await prisma.academicYear.findMany({
          select: {
            id: true,
            label: true,
          },
        });

        // Fetch data from Branch
        const branches = await prisma.branch.findMany({
          select: {
            id: true,
            name: true,
          },
        });

        // Combine all the data
        const combinedData = {
          classes,
          sections,
          academicYears,
          branches,
        };

        res.status(200).json(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
      }
      break;
    }

    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
