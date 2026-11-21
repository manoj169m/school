// pages/api/rooms/[hostelId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { hostelId } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const rooms = await prisma.room.findMany({
          where: {
            hostelId: parseInt(hostelId as string)
          },
          select: {
            id: true,
            roomNumber: true,
            capacity: true,
            floorNumber: true,
            hostelId: true,
          },
          orderBy: {
            roomNumber: 'asc',
          },
        });

        res.status(200).json(rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Error fetching rooms' });
      }
      break;
  }
}