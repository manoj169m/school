import { NextApiRequest, NextApiResponse } from 'next';
import  prisma  from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const categories = await prisma.concessionCategory.findMany({
        select: {
          id: true,
          name: true
        }
      });
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching concession categories:', error);
      return res.status(500).json({ error: 'Failed to fetch concession categories' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}