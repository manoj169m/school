import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    // Handle GET request - Retrieve a single fee category by ID
    case 'GET':
      try {
        const feeCategory = await prisma.feeCategory.findUnique({
          where: { id: parseInt(id as string) },
        });
        if (!feeCategory) {
          return res.status(404).json({ error: 'Fee category not found' });
        }
        res.status(200).json(feeCategory);
      } catch (error) {
        console.error('Error fetching fee category:', error);
        res.status(500).json({ error: 'Error fetching fee category' });
      }
      break;

    // Handle PUT request - Update a fee category by ID
    case 'PUT':
      const { category, description } = req.body;
      try {
        const updatedFeeCategory = await prisma.feeCategory.update({
          where: { id: parseInt(id as string) },
          data: {
            category,
            description,
          },
        });
        res.status(200).json(updatedFeeCategory);
      } catch (error) {
        console.error('Error updating fee category:', error);
        res.status(500).json({ error: 'Error updating fee category' });
      }
      break;

    // Handle DELETE request - Delete a fee category by ID
    case 'DELETE':
      try {
        await prisma.feeCategory.delete({
          where: { id: parseInt(id as string) },
        });
        res.status(204).json({ message: 'Fee category deleted successfully' });
      } catch (error) {
        console.error('Error deleting fee category:', error);
        res.status(500).json({ error: 'Error deleting fee category' });
      }
      break;

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
