import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      try {
        const classes = await prisma.class.findMany({
          include: {
            enrollments: true,
            periods: true,
            exam: true,
            message: true,
            announcement: true,
            branchClassSection: true,
          },
          orderBy: {
            displayOrder: 'asc',
          },
        });
        res.status(200).json(classes);
      } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: 'Error fetching classes' });
      }
      break;
    }

    case 'POST': {
      const { name, acronym, displayOrder } = req.body;

      try {
        const newClass = await prisma.class.create({
          data: { name, acronym, displayOrder },
        });
        res.status(201).json(newClass);
      } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ error: 'Error creating class' });
      }
      break;
    }

    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
