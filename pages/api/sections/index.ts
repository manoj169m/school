import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      try {
        const sections = await prisma.section.findMany({
          skip,
          take,
          select: {
            id: true,
            name: true,
            acronym: true,
            displayOrder: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            name: 'asc',
          },
        });

        res.status(200).json(sections);
      } catch (error) {
        console.error('Error fetching sections:', error);
        res.status(500).json({ error: 'Error fetching sections' });
      }
      break;
    }

    case 'POST': {
      const { name, acronym, displayOrder } = req.body;

      try {
        const newSection = await prisma.section.create({
          data: {
            name,
            acronym,
            displayOrder,
          },
        });

        res.status(201).json(newSection);
      } catch (error) {
        console.error('Error creating section:', error);
        res.status(500).json({ error: 'Error creating section' });
      }
      break;
    }

    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
