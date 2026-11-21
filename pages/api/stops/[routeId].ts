// pages/api/stops/[routeId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { routeId } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const stops = await prisma.stop.findMany({
          where: {
            routeId: parseInt(routeId as string)
          },
          select: {
            id: true,
            stopName: true,
            stopNumber: true,
            distance: true,
            landMark: true,
            routeId: true,
          },
          orderBy: {
            stopNumber: 'asc',
          },
        });

        res.status(200).json(stops);
      } catch (error) {
        console.error('Error fetching stops:', error);
        res.status(500).json({ error: 'Error fetching stops' });
      }
      break;
  }
}