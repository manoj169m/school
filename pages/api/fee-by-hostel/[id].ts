import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    // Handle GET request - Retrieve a single hostel fee by ID
    case 'GET':
      try {
        const hostelFee = await prisma.hostelFee.findUnique({
          where: { id: parseInt(id as string) },
          include: {
            hostel: {
              select: {
                hostelName: true
              }
            },
            academicYear: {
              select: {
                label: true
              }
            },
            account: {
              select: {
                accountName: true
              }
            }
          }
        });

        if (!hostelFee) {
          return res.status(404).json({ error: 'Hostel fee record not found' });
        }

        res.status(200).json(hostelFee);
      } catch (error) {
        console.error('Error fetching hostel fee:', error);
        res.status(500).json({ error: 'Error fetching hostel fee' });
      }
      break;

    // Handle PUT request - Update a hostel fee by ID
    case 'PUT':
      try {
        const { hostelId, academicYearId, accountId, feeAmount, term } = req.body;

        // Validate required fields
        if (!hostelId || !academicYearId || !accountId || !feeAmount || !term) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if the fee record exists
        const existingFee = await prisma.hostelFee.findUnique({
          where: { id: parseInt(id as string) }
        });

        if (!existingFee) {
          return res.status(404).json({ error: 'Hostel fee record not found' });
        }

        // Validate relationships exist
        const [hostel, academicYear, account] = await Promise.all([
          prisma.hostel.findUnique({ where: { id: hostelId } }),
          prisma.academicYear.findUnique({ where: { id: academicYearId } }),
          prisma.account.findUnique({ where: { id: accountId } })
        ]);

        if (!hostel || !academicYear || !account) {
          return res.status(400).json({ error: 'Invalid relationship IDs' });
        }

        const updatedHostelFee = await prisma.hostelFee.update({
          where: { id: parseInt(id as string) },
          data: {
            hostelId,
            academicYearId,
            accountId,
            feeAmount,
            term
          },
          include: {
            hostel: {
              select: {
                hostelName: true
              }
            },
            academicYear: {
              select: {
                label: true
              }
            },
            account: {
              select: {
                accountName: true
              }
            }
          }
        });

        res.status(200).json(updatedHostelFee);
      } catch (error) {
        console.error('Error updating hostel fee:', error);
        res.status(500).json({ error: 'Error updating hostel fee' });
      }
      break;

    // Handle DELETE request - Delete a hostel fee by ID
    case 'DELETE':
      try {
        // Check if the fee record exists
        const existingFee = await prisma.hostelFee.findUnique({
          where: { id: parseInt(id as string) }
        });

        if (!existingFee) {
          return res.status(404).json({ error: 'Hostel fee record not found' });
        }

        // Check for any related assignments before deletion
        const hasAssignments = await prisma.hostelAssignment.findFirst({
          where: {   id : parseInt(id as string) }
        });

        if (hasAssignments) {
          return res.status(400).json({ 
            error: 'Cannot delete fee record with existing assignments' 
          });
        }

        await prisma.hostelFee.delete({
          where: { id: parseInt(id as string) }
        });

        res.status(204).end();
      } catch (error) {
        console.error('Error deleting hostel fee:', error);
        res.status(500).json({ error: 'Error deleting hostel fee' });
      }
      break;

    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}