import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

// pages/api/adminroutes/[id].ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    console.log('API called with id:', id); // Debug log
  
    switch (req.method) {
      case 'GET':
        try {
          const routes = await prisma.route.findMany({
            where: {
              academicYearId: parseInt(id as string)
            },
            select: {
              id: true,
              routeName: true,
              academicYearId: true,
              numberOfStops: true,
              vehicleId: true,
            },
            orderBy: {
              routeName: 'asc',
            },
          });
          console.log('Found routes:', routes); // Debug log
          res.status(200).json(routes);
        } catch (error) {
          console.error('Error fetching routes:', error);
          res.status(500).json({ error: 'Error fetching routes' });
        }
        break;
    }
  }