import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

// Define interfaces for type safety
interface Stop {
  stopNumber: number;
  stopName: string;
  distance: string;
  landMark: string;
}

interface RouteUpdateData {
  routeName: string;
  numberOfStops: number;
  academicYearId: number;
  vehicleId: number;
  stops: Stop[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    // Handle GET request for fetching a specific route by ID
    case 'GET': {
      try {
        if (!id) {
          return res.status(400).json({ error: 'Route ID is required' });
        }

        // Fetch the route by its ID and include related vehicle, academic year, and stops
        const route = await prisma.route.findUnique({
          where: { id: parseInt(id as string, 10) },
          include: {
            stops: true,
            vehicle: {
              select: {
                vehicleNumber: true,
                regNo: true,
              }
            },
            academicYear: {
              select: {
                label: true,
              }
            },
          },
        });

        if (!route) {
          return res.status(404).json({ error: 'Route not found' });
        }

        const formattedRoute = {
          id: route.id,
          routeName: route.routeName,
          numberOfStops: route.numberOfStops,
          academicYearId: route.academicYearId,
          vehicleId: route.vehicleId,
          vehicle: {
            vehicleNumber: route.vehicle?.vehicleNumber,
            regNo: route.vehicle?.regNo,
          },
          academicYear: {
            label: route.academicYear?.label,
          },
          stops: route.stops.map(stop => ({
            stopNumber: stop.stopNumber,
            stopName: stop.stopName,
            distance: stop.distance,
            landMark: stop.landMark,
          })),
        };

        res.status(200).json(formattedRoute);
      } catch (error) {
        console.error('Error fetching route:', error);
        if (error instanceof Error) {
          res.status(500).json({ error: 'Error fetching route', details: error.message });
        } else {
          res.status(500).json({ error: 'Unexpected error occurred' });
        }
      }
      break;
    }

    // Handle PUT request for updating a specific route by ID
    case 'PUT': {
      try {
        if (!id) {
          return res.status(400).json({ error: 'Route ID is required' });
        }

        // Destructure and type the request body
        const { 
          routeName, 
          numberOfStops, 
          academicYearId, 
          vehicleId, 
          stops 
        }: RouteUpdateData = req.body;

        // Update the route
        const updatedRoute = await prisma.route.update({
          where: { id: parseInt(id as string, 10) },
          data: {
            routeName,
            numberOfStops,
            academicYearId,
            vehicleId,
          },
        });

        // Update the associated stops (delete existing ones and create new ones)
        await prisma.stop.deleteMany({ where: { routeId: updatedRoute.id } });

        const updatedStops = await Promise.all(stops.map((stop: Stop) => 
          prisma.stop.create({
            data: {
              routeId: updatedRoute.id,
              stopNumber: stop.stopNumber,
              stopName: stop.stopName,
              distance: stop.distance,
              landMark: stop.landMark,
            }
          })
        ));

        res.status(200).json({ route: updatedRoute, stops: updatedStops });
      } catch (error) {
        console.error('Error updating route:', error);
        if (error instanceof Error) {
          res.status(500).json({ error: 'Error updating route', details: error.message });
        } else {
          res.status(500).json({ error: 'Unexpected error occurred' });
        }
      }
      break;
    }

    // Handle DELETE request for deleting a specific route by ID
    case 'DELETE': {
      try {
        if (!id) {
          return res.status(400).json({ error: 'Route ID is required' });
        }

        // Delete the route and its associated stops
        const deletedRoute = await prisma.route.delete({
          where: { id: parseInt(id as string, 10) },
        });

        res.status(200).json({ message: 'Route deleted successfully', route: deletedRoute });
      } catch (error) {
        console.error('Error deleting route:', error);
        if (error instanceof Error) {
          res.status(500).json({ error: 'Error deleting route', details: error.message });
        } else {
          res.status(500).json({ error: 'Unexpected error occurred' });
        }
      }
      break;
    }

    default: {
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
    }
  }
}