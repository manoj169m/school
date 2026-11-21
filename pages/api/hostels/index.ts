import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);
      
      try {
        const hostels = await prisma.hostel.findMany({
          skip,
          take,
          select: {
            id: true,
            hostelName: true,
            floorCount: true,
            capacity: true,
            type: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            hostelName: 'asc', // Order by hostel name
          },
        });
        
        res.status(200).json(hostels);
      } catch (error) {
        console.error('Error fetching hostels:', error);
        res.status(500).json({ error: 'Error fetching hostels' });
      }
      break;
    
    // Handle POST request - Create a new hostel
    case 'POST':
      const { hostelName, floorCount, capacity, type } = req.body;
      
      try {
        const newHostel = await prisma.hostel.create({
          data: {
            hostelName,
            floorCount,
            capacity,
            type
          },
        });
        
        res.status(201).json(newHostel);
      } catch (error) {
        console.error('Error creating hostel:', error);
        res.status(500).json({ error: 'Error creating hostel' });
      }
      break;
    
    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}