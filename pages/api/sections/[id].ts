import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid or missing ID' });
  }

  const sectionId = parseInt(id as string);

  switch (req.method) {
    case 'GET': {
      try {
        const section = await prisma.section.findUnique({
          where: { id: sectionId },
        });

        if (!section) {
          return res.status(404).json({ error: 'Section not found' });
        }

        res.status(200).json(section);
      } catch (error) {
        console.error('Error fetching section:', error);
        res.status(500).json({ error: 'Error fetching section' });
      }
      break;
    }

    case 'PUT': {
      const { name, acronym, displayOrder } = req.body;

      try {
        const updatedSection = await prisma.section.update({
          where: { id: sectionId },
          data: {
            name,
            acronym,
            displayOrder,
          },
        });

        res.status(200).json(updatedSection);
      } catch (error) {
        console.error('Error updating section:', error);
        res.status(500).json({ error: 'Error updating section' });
      }
      break;
    }

    case 'DELETE': {
      try {
        await prisma.section.delete({
          where: { id: sectionId },
        });

        res.status(204).end(); // No content response for successful deletion
      } catch (error) {
        console.error('Error deleting section:', error);
        res.status(500).json({ error: 'Error deleting section' });
      }
      break;
    }

    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
