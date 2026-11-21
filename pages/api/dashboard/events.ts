// pages/api/events.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

type EventResponse = {
  id: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  type: string;
  branchId: number | null;
  branchName: string | undefined;
  incharger: {
    name: string;
    designation: string;
    imageUrl: string;
  };
  imageUrl: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventResponse[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { branchId } = req.query;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const whereClause = {
      date: {
        gte: today,
      },
      ...(branchId && branchId !== 'all' 
        ? { branchId: parseInt(branchId as string) } 
        : {}
      ),
    };

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    const transformedEvents: EventResponse[] = events.map(event => ({
      id: event.id,
      name: event.eventName,
      date: event.date.toISOString(),
      startTime: event.startTime.toLocaleTimeString(),
      endTime: event.endTime.toLocaleTimeString(),
      location: event.locationName,
      description: event.description,
      type: event.type,
      branchId: event.branchId,
      branchName: event.branch?.name,
      incharger: {
        name: event.organizerName,
        designation: 'Event Organizer',
        imageUrl: '/placeholder-organizer.jpg'
      },
      imageUrl: `/event-images/${event.id}.jpg`
    }));

    return res.status(200).json(transformedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}