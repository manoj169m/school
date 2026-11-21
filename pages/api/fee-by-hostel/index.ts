import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const hostelFees = await prisma.hostelFee.findMany({
          select: {
            id: true,
            hostelId: true,
            academicYearId: true,
            accountId: true,
            feeAmount: true,
            term: true,
            createdAt: true,
            updatedAt: true,
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
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        const transformedFees = hostelFees.map(fee => ({
          id: fee.id,
          hostelId: fee.hostelId,
          academicYearId: fee.academicYearId,
          accountId: fee.accountId,
          hostelName: fee.hostel.hostelName,
          academicYear: fee.academicYear.label,
          accountName: fee.account.accountName,
          feeAmount: fee.feeAmount,
          term: fee.term,
          createdAt: fee.createdAt,
          updatedAt: fee.updatedAt
        }));

        res.status(200).json(transformedFees);
      } catch (error) {
        console.error('Error fetching hostel fees:', error);
        res.status(500).json({ error: 'Error fetching hostel fees' });
      }
      break;

    case 'POST':
      try {
        const { hostelId, academicYearId, accountId, feeAmount, term } = req.body;

        if (!hostelId || !academicYearId || !accountId || !feeAmount || !term) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingFee = await prisma.hostelFee.findFirst({
          where: {
            hostelId: Number(hostelId),
            academicYearId: Number(academicYearId),
            accountId: Number(accountId),
            term: Number(term),
          },
        });

        if (existingFee) {
          return res.status(400).json({
            error: 'A fee record with these criteria already exists'
          });
        }

        const [hostel, academicYear, account] = await Promise.all([
          prisma.hostel.findUnique({ where: { id: Number(hostelId) } }),
          prisma.academicYear.findUnique({ where: { id: Number(academicYearId) } }),
          prisma.account.findUnique({ where: { id: Number(accountId) } }),
        ]);

        if (!hostel || !academicYear || !account) {
          return res.status(400).json({ error: 'Invalid relationship IDs' });
        }

        const newHostelFee = await prisma.hostelFee.create({
          data: {
            hostelId: Number(hostelId),
            academicYearId: Number(academicYearId),
            accountId: Number(accountId),
            feeAmount: Number(feeAmount),
            term: Number(term),
          },
          select: {
            id: true,
            hostelId: true,
            academicYearId: true,
            accountId: true,
            feeAmount: true,
            term: true,
            createdAt: true,
            updatedAt: true,
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

        const transformedNewFee = {
          id: newHostelFee.id,
          hostelId: newHostelFee.hostelId,
          academicYearId: newHostelFee.academicYearId,
          accountId: newHostelFee.accountId,
          hostelName: newHostelFee.hostel.hostelName,
          academicYear: newHostelFee.academicYear.label,
          accountName: newHostelFee.account.accountName,
          feeAmount: newHostelFee.feeAmount,
          term: newHostelFee.term,
          createdAt: newHostelFee.createdAt,
          updatedAt: newHostelFee.updatedAt
        };

        res.status(201).json(transformedNewFee);
      } catch (error) {
        console.error('Error creating hostel fee:', error);
        res.status(500).json({ 
          error: error instanceof Error ? error.message : 'Error creating hostel fee'
        });
      }
      break;

    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
