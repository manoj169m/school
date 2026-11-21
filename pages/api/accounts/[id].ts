import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Account ID is required' });
  }

  switch (req.method) {
    // Fetch a single account by ID
    case 'GET': {
      try {
        const account = await prisma.account.findUnique({
          where: { id: parseInt(id as string) },
        });
        if (!account) {
          return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json(account);
      } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({ error: 'Error fetching account' });
      }
      break;
    }

    // Update an account by ID
    case 'PUT': {
      const { accountName, accountType, description, openingBalance, applicableFor } = req.body;

      try {
        const updatedAccount = await prisma.account.update({
          where: { id: parseInt(id as string) },
          data: {
            accountName,
            accountType,
            description,
            openingBalance,
            applicableFor,
          },
        });
        res.status(200).json(updatedAccount);
      } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ error: 'Error updating account' });
      }
      break;
    }

    // Delete an account by ID
    case 'DELETE': {
      try {
        await prisma.account.delete({
          where: { id: parseInt(id as string) },
        });
        res.status(204).end();
      } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Error deleting account' });
      }
      break;
    }

    // Method not allowed
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
