import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    // Handle GET request - Retrieve a single concession category by ID
    case 'GET':
      try {
        const concessionCategory = await prisma.concessionCategory.findUnique({
          where: { id: parseInt(id as string) },
        });
        if (!concessionCategory) {
          return res.status(404).json({ error: 'Concession category not found' });
        }
        res.status(200).json(concessionCategory);
      } catch (error) {
        console.error('Error fetching concession category:', error);
        res.status(500).json({ error: 'Error fetching concession category' });
      }
      break;

    // Handle PUT request - Update a concession category by ID
    case 'PUT':
      const { name, description } = req.body;
      try {
        const updatedConcessionCategory = await prisma.concessionCategory.update({
          where: { id: parseInt(id as string) },
          data: {
            name,
            description,
          },
        });
        res.status(200).json(updatedConcessionCategory);
      } catch (error) {
        console.error('Error updating concession category:', error);
        res.status(500).json({ error: 'Error updating concession category' });
      }
      break;

    // Handle DELETE request - Delete a concession category by ID
    case 'DELETE':
      try {
        await prisma.concessionCategory.delete({
          where: { id: parseInt(id as string) },
        });
        res.status(204).json({ message: 'Concession category deleted successfully' });
      } catch (error) {
        console.error('Error deleting concession category:', error);
        res.status(500).json({ error: 'Error deleting concession category' });
      }
      break;

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
