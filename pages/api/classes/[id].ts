import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid or missing ID' });
  }

  const classId = parseInt(id as string);

  switch (req.method) {
    case 'GET': {
      try {
        const classData = await prisma.class.findUnique({
          where: { id: classId },
          include: {
            enrollments: true,
            periods: true,
            exam: true,
            message: true,
            announcement: true,
            branchClassSection: true,
          },
        });
        if (!classData) {
          return res.status(404).json({ error: 'Class not found' });
        }
        res.status(200).json(classData);
      } catch (error) {
        console.error('Error fetching class:', error);
        res.status(500).json({ error: 'Error fetching class' });
      }
      break;
    }

    case 'PUT': {
      const { name, acronym, displayOrder } = req.body;

      try {
        const updatedClass = await prisma.class.update({
          where: { id: classId },
          data: { name, acronym, displayOrder },
        });
        res.status(200).json(updatedClass);
      } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({ error: 'Error updating class' });
      }
      break;
    }

    case 'DELETE': {
      try {
        await prisma.class.delete({ where: { id: classId } });
        res.status(204).end();
      } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ error: 'Error deleting class' });
      }
      break;
    }

    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
