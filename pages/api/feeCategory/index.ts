import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // Handle GET request - Retrieve all fee categories with pagination and optimization
    case 'GET':
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      try {
        const feeCategories = await prisma.feeCategory.findMany({
          skip,
          take,
          select: {
            id: true,
            category: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            category: 'asc', // Optionally, order by category
          },
        });
        res.status(200).json(feeCategories);
      } catch (error) {
        console.error('Error fetching fee categories:', error);
        res.status(500).json({ error: 'Error fetching fee categories' });
      }
      break;

    // Handle POST request - Create a new fee category
    case 'POST':
      const { category, description } = req.body;
      try {
        const newFeeCategory = await prisma.feeCategory.create({
          data: {
            category,
            description,
          },
        });
        res.status(201).json(newFeeCategory);
      } catch (error) {
        console.error('Error creating fee category:', error);
        res.status(500).json({ error: 'Error creating fee category' });
      }
      break;

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
