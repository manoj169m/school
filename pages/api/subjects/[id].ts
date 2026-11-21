import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    // Retrieve a single subject by ID
    case 'GET': {
      try {
        const subject = await prisma.subject.findUnique({
          where: { id: parseInt(id as string) },
        });
        if (!subject) {
          return res.status(404).json({ error: 'Subject not found' });
        }
        res.status(200).json(subject);
      } catch (error) {
        console.error('Error fetching subject:', error);
        res.status(500).json({ error: 'Error fetching subject' });
      }
      break;
    }

    // Update a subject by ID
    case 'PUT': {
      const { name, code, description } = req.body;
      try {
        const updatedSubject = await prisma.subject.update({
          where: { id: parseInt(id as string) },
          data: { name, code, description },
        });
        res.status(200).json(updatedSubject);
      } catch (error) {
        console.error('Error updating subject:', error);
        res.status(500).json({ error: 'Error updating subject' });
      }
      break;
    }

    // Delete a subject by ID
    case 'DELETE': {
      try {
        await prisma.subject.delete({
          where: { id: parseInt(id as string) },
        });
        res.status(204).json({ message: 'Subject deleted successfully' });
      } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).json({ error: 'Error deleting subject' });
      }
      break;
    }

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
