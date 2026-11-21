import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

interface Room {
    id: number;
    roomNumber: string;
    capacity: number;
  }
  
  interface Floor {
    floorNumber: number;
    rooms: Room[];
  }
  
  interface HostelRoomsResponse {
    id: number;
    hostelName: string;
    totalFloors: number;
    floors: Floor[];
  }
  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // Handle POST requests - Create rooms for a specific floor and hostel.
    case 'POST':
      try {
        const { floorNumber, hostelId, rooms } = req.body;

        // Validate input
        if (!floorNumber || !hostelId || !rooms || !Array.isArray(rooms)) {
          return res.status(400).json({ error: 'Invalid input data' });
        }

        // Create rooms in a transaction to ensure data integrity
        const createdRooms = await prisma.$transaction(
          rooms.map(room => 
            prisma.room.create({
              data: {
                hostelId: hostelId,
                floorNumber: floorNumber,
                roomNumber: room.roomNumber,
                capacity: room.capacity
              }
            })
          )
        );

        res.status(201).json({
          message: 'Rooms created successfully',
          rooms: createdRooms
        });
      } catch (error) {
        console.error('Error creating rooms:', error);
        res.status(500).json({ 
          error: 'Error creating rooms',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    // Handle GET request - Retrieve rooms for a specific hostel and floor
    case 'GET':
      try {
        // Fetch the hostel with its rooms, joining with the Hostel model to get hostel name
        const hostelRooms = await prisma.room.findMany({
          include: {
            hostel: true // This ensures we can access hostel details
          },
          orderBy: [
            { floorNumber: 'asc' },
            { roomNumber: 'asc' }
          ]
        });

        // If no rooms found, return early
        if (hostelRooms.length === 0) {
          return res.status(404).json({ error: 'No rooms found' });
        }

        // Get the hostel name (assuming first room's hostel is the same for all)
        const hostelName = hostelRooms[0].hostel.hostelName;
        const hostelId = hostelRooms[0].hostelId;

        // Group rooms by floor number
        const floorMap: Record<number, Room[]> = hostelRooms.reduce((acc, room) => {
          if (!acc[room.floorNumber]) {
            acc[room.floorNumber] = [];
          }
          acc[room.floorNumber].push({
            id: room.id,
            roomNumber: room.roomNumber,
            capacity: room.capacity
          });
          return acc;
        }, {} as Record<number, Room[]>);

        // Convert floor map to sorted array of floors
        const floors: Floor[] = Object.entries(floorMap)
          .map(([floorNumber, rooms]) => ({
            floorNumber: Number(floorNumber),
            rooms: rooms
          }))
          .sort((a, b) => a.floorNumber - b.floorNumber);

        // Construct the response
        const response: HostelRoomsResponse = {
          id: hostelId,
          hostelName,
          totalFloors: floors.length,
          floors: floors
        };

        res.status(200).json(response);
      } catch (error) {
        console.error('Error fetching hostel rooms:', error);
        res.status(500).json({ 
          error: 'Error fetching hostel rooms',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;


    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}