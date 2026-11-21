import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // Retrieve all subjects with pagination
    case 'GET': {
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      try {
        const subjects = await prisma.subject.findMany({
          skip,
          take,
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { name: 'asc' },
        });
        res.status(200).json(subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Error fetching subjects' });
      }
      break;
    }

    // Create a new subject
    case 'POST': {
      const { name, code, description } = req.body;
      try {
        const newSubject = await prisma.subject.create({
          data: { name, code, description },
        });
        res.status(201).json(newSubject);
      } catch (error) {
        console.error('Error creating subject:', error);
        res.status(500).json({ error: 'Error creating subject' });
      }
      break;
    }

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
