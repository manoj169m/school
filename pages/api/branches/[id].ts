import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    // Handle GET request - Retrieve a single branch by ID
    case 'GET':
      try {
        const branch = await prisma.branch.findUnique({
          where: { id: parseInt(id as string) },
        });
        if (!branch) {
          return res.status(404).json({ error: 'Branch not found' });
        }
        res.status(200).json(branch);
      } catch (error) {
        console.error('Error fetching branch:', error);
        res.status(500).json({ error: 'Error fetching branch' });
      }
      break;

    // Handle PUT request - Update a branch by ID
    case 'PUT':
      const { name, acronym, label, inCharge, contact, address, location } = req.body;
      try {
        const updatedBranch = await prisma.branch.update({
          where: { id: parseInt(id as string) },
          data: {
            name,
            acronym,
            label,
            inCharge,
            contact,
            address,
            location,
          },
        });
        res.status(200).json(updatedBranch);
      } catch (error) {
        console.error('Error updating branch:', error);
        res.status(500).json({ error: 'Error updating branch' });
      }
      break;

    // Handle DELETE request - Delete a branch by ID
    case 'DELETE':
      try {
        await prisma.branch.delete({
          where: { id: parseInt(id as string) },
        });
        res.status(204).json({ message: 'Branch deleted successfully' });
      } catch (error) {
        console.error('Error deleting branch:', error);
        res.status(500).json({ error: 'Error deleting branch' });
      }
      break;

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
