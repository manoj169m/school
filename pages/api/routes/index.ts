import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

// Define interfaces for type safety
interface Stop {
  stopNumber: number;
  stopName: string;
  distance: string;
  landMark: string;
}

interface RouteData {
  routeName: string;
  numberOfStops: number;
  academicYearId: number;
  vehicleId: number;
  stops: Stop[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      try {
        // Extract academicYearId from query parameters
        const { academicYearId } = req.query;
    
        // Ensure academicYearId is a number and convert it
        const academicYearIdInt = academicYearId ? parseInt(academicYearId as string, 10) : undefined;
    
        // Fetch routes with related vehicles and academic years
        const routes = await prisma.route.findMany({
          where: academicYearIdInt
            ? { academicYearId: academicYearIdInt } // Filter by academicYearId
            : {}, // If no filter, fetch all routes
          include: {
            stops: true, // Include the stops associated with each route
            vehicle: { // Include the vehicle details based on vehicleId
              select: {
                vehicleNumber: true,
                regNo: true,
              }
            },
            academicYear: { // Include the academic year details based on academicYearId
              select: {
                label: true,
              }
            },
          },
        });
    
        // Format the response to include routes, stops, vehicle details, and academic year label
        const formattedRoutes = routes.map(route => ({
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
        }));
    
        res.status(200).json(formattedRoutes);
      } catch (error) {
        console.error('Error fetching routes:', error);
    
        if (error instanceof Error) {
          res.status(500).json({
            error: 'Error fetching routes',
            details: error.message,
          });
        } else {
          res.status(500).json({ error: 'Unexpected error occurred' });
        }
      }
      break;
    }

    case 'POST': {
      try {
        // Destructure and type the request body
        const { 
          routeName, 
          numberOfStops, 
          academicYearId, 
          vehicleId, 
          stops 
        }: RouteData = req.body;

        // Create the route with its associated stops in a single transaction
        const newRoute = await prisma.$transaction(async (prisma) => {
          // Create the route first
          const route = await prisma.route.create({
            data: {
              routeName,
              numberOfStops,
              academicYearId,
              vehicleId,
            }
          });

          // Create stops associated with the route
          const createdStops = await Promise.all(stops.map((stop: Stop) => 
            prisma.stop.create({
              data: {
                routeId: route.id,
                stopNumber: stop.stopNumber,
                stopName: stop.stopName,
                distance: stop.distance,
                landMark: stop.landMark
              }
            })
          ));

          return { route, stops: createdStops };
        });

        res.status(201).json(newRoute);
      } catch (error) {
        console.error('Error creating route:', error);
        
        // More detailed error handling
        if (error instanceof Error) {
          res.status(500).json({ 
            error: 'Error creating route',
            details: error.message 
          });
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