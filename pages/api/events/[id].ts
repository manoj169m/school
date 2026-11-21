import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Extract `id` from the URL

  switch (req.method) {
    // Retrieve a single event by ID
    case 'GET': {
      try {
        const event = await prisma.event.findUnique({
          where: { id: parseInt(id as string) },
          select: {
            id: true,
            eventName: true,
            locationName: true,
            date: true,
            startTime: true,
            endTime: true,
            organizerName: true,
            description: true,
            type: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!event) {
          return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json(event);
      } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Error fetching event' });
      }
      break;
    }

    // Update an existing event by ID
    case 'PUT': {
      const { eventName, locationName, date, startTime, endTime, organizerName, description, type } = req.body;

      try {
        const updatedEvent = await prisma.event.update({
          where: { id: parseInt(id as string) },
          data: {
            eventName,
            locationName,
            date: new Date(date),
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            organizerName,
            description,
            type,
          },
        });

        res.status(200).json(updatedEvent);
      } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Error updating event' });
      }
      break;
    }

    // Delete an event by ID
    case 'DELETE': {
      try {
        await prisma.event.delete({
          where: { id: parseInt(id as string) },
        });

        res.status(200).json({ message: 'Event deleted successfully' });
      } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Error deleting event' });
      }
      break;
    }

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
