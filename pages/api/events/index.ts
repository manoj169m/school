import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // Retrieve all events with pagination
    case 'GET': {
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      try {
        // Get total count for pagination
        const totalCount = await prisma.event.count();

        // Fetch events with branch information
        const events = await prisma.event.findMany({
          skip,
          take,
          select: {
            id: true,
            eventName: true,
            locationName: true,
            date: true,
            startTime: true,
            endTime: true,
            organizerName: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            branchId: true,
            type: true,
            branch: {
              select: {
                id: true,
                label: true,
                acronym: true,
              }
            }
          },
          orderBy: { date: 'asc' },
        });

        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / take);
        const hasMore = skip + take < totalCount;

        res.status(200).json({
          events,
          pagination: {
            currentPage: parseInt(page as string),
            totalPages,
            totalCount,
            hasMore,
          }
        });
      } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Error fetching events' });
      }
      break;
    }

    // Create a new event
    case 'POST': {
      const { 
        eventName, 
        locationName, 
        date, 
        startTime, 
        endTime, 
        organizerName, 
        description, 
        branchId,
        type,
      } = req.body;

      try {
        // Validate branchId exists
        const branch = await prisma.branch.findUnique({
          where: { id: branchId }
        });

        if (!branch) {
          return res.status(400).json({ error: 'Invalid branch ID' });
        }

        // Validate dates
        const eventDate = new Date(date);
        const eventStartTime = new Date(startTime);
        const eventEndTime = new Date(endTime);

        if (eventEndTime <= eventStartTime) {
          return res.status(400).json({ 
            error: 'End time must be after start time' 
          });
        }

        const newEvent = await prisma.event.create({
          data: {
            eventName,
            locationName,
            date: eventDate,
            startTime: eventStartTime,
            endTime: eventEndTime,
            branchId,
            organizerName,
            description,
            type,
          },
        });

        res.status(201).json(newEvent);
      } catch (error) {
        console.error('Error creating event:', error);
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Error creating event' });
        }
      }
      break;
    }

    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}