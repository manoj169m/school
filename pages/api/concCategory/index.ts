import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // Handle GET request - Retrieve all concession categories
    case 'GET':
      try {
        const concessionCategories = await prisma.concessionCategory.findMany();
        res.status(200).json(concessionCategories);
      } catch (error) {
        console.error('Error fetching concession categories:', error);
        res.status(500).json({ error: 'Error fetching concession categories' });
      }
      break;

    // Handle POST request - Create a new concession category
    case 'POST':
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      try {
        const newConcessionCategory = await prisma.concessionCategory.create({
          data: {
            name,
            description,
          },
        });
        res.status(201).json(newConcessionCategory);
      } catch (error) {
        console.error('Error creating concession category:', error);
        res.status(500).json({ error: 'Error creating concession category' });
      }
      break;

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
