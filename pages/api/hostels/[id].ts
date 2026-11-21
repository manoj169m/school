import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    // Handle GET request - Retrieve a single hostel by ID
    case 'GET':
      try {
        const hostel = await prisma.hostel.findUnique({
          where: { id: parseInt(id as string) },
          include: {
            assignments: true,
            fees: true,
            rooms: true
          }
        });

        if (!hostel) {
          return res.status(404).json({ error: 'Hostel not found' });
        }

        res.status(200).json(hostel);
      } catch (error) {
        console.error('Error fetching hostel:', error);
        res.status(500).json({ error: 'Error fetching hostel' });
      }
      break;

    // Handle PUT request - Update a hostel by ID
    case 'PUT':
      const { hostelName, floorCount, capacity, type } = req.body;

      try {
        const updatedHostel = await prisma.hostel.update({
          where: { id: parseInt(id as string) },
          data: {
            hostelName,
            floorCount,
            capacity,
            type
          }
        });

        res.status(200).json(updatedHostel);
      } catch (error) {
        console.error('Error updating hostel:', error);
        res.status(500).json({ error: 'Error updating hostel' });
      }
      break;

    // Handle DELETE request - Delete a hostel by ID
    case 'DELETE':
      try {
        await prisma.hostel.delete({
          where: { id: parseInt(id as string) }
        });

        res.status(204).json({ message: 'Hostel deleted successfully' });
      } catch (error) {
        console.error('Error deleting hostel:', error);
        res.status(500).json({ error: 'Error deleting hostel' });
      }
      break;

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}