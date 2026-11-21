import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // Fetch all accounts with pagination
    case 'GET': {
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      try {
        const accounts = await prisma.account.findMany({
          skip,
          take,
          orderBy: { createdAt: 'desc' }, // Optionally sort by createdAt
        });
        res.status(200).json(accounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Error fetching accounts' });
      }
      break;
    }

    // Create a new account
    case 'POST': {
      const { accountName, accountType, description, openingBalance, applicableFor } = req.body;

      try {
        const newAccount = await prisma.account.create({
          data: {
            accountName,
            accountType,
            description,
            openingBalance,
            applicableFor,
          },
        });
        res.status(201).json(newAccount);
      } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ error: 'Error creating account' });
      }
      break;
    }

    // Method not allowed
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
