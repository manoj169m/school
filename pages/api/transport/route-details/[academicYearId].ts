import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { academicYearId } = req.query;
    
    if (!academicYearId || Array.isArray(academicYearId)) {
      return res.status(400).json({ message: 'Invalid academic year ID' });
    }

    const academicYearIdNum = parseInt(academicYearId);

    const routeDetails = await prisma.route.findMany({
      where: {
        academicYearId: academicYearIdNum,
        transportAssignments: {
          some: {
            status: 'Using'
          }
        }
      },
      include: {
        vehicle: true,
        stops: {
          include: {
            transportAssignments: {
              where: {
                status: 'Using'
              },
              include: {
                studentEnrollment: {
                  include: {
                    student: true
                  }
                }
              }
            }
          }
        },
        transportFees: true
      }
    });

    const formattedRoutes = routeDetails.map(route => ({
      id: route.id,
      routeName: route.routeName,
      vehicleNumber: route.vehicle.vehicleNumber,
      driverName: route.vehicle.driverName,
      numberOfStops: route.numberOfStops,
      totalStudents: route.stops.reduce((acc, stop) => 
        acc + stop.transportAssignments.length, 0
      ),
      stops: route.stops.map(stop => ({
        id: stop.id,
        name: stop.stopName,
        studentCount: stop.transportAssignments.length,
        fee: route.transportFees.find(f => f.stopId === stop.id)?.feeAmount || 0
      }))
    }));

    return res.status(200).json(formattedRoutes);
  } catch (error) {
    console.error('Error fetching route details:', error);
    return res.status(500).json({ message: 'Failed to fetch route details' });
  }
}