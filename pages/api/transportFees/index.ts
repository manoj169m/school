import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    // Create or update transport fees
    case 'POST': {
      try {
        // Validate input
        const fees = req.body;

        if (!Array.isArray(fees) || fees.length === 0) {
          return res.status(400).json({ 
            error: 'Invalid input. Expected an array of transport fees.' 
          });
        }

        const result = await prisma.$transaction(async (prismaClient) => {
          const createdFees = [];

          for (const feeData of fees) {
            if (!feeData.term || !feeData.feeAmount || 
                !feeData.stopId || !feeData.routeId || 
                !feeData.academicYearId || !feeData.accountId) {
              throw new Error('Incomplete fee data');
            }

            const upsertedFee = await prismaClient.transportFee.upsert({
              where: {
                unique_fee_per_term_per_stop_per_year: {
                  routeId: feeData.routeId,
                  stopId: feeData.stopId,
                  term: feeData.term,
                  academicYearId: feeData.academicYearId
                }
              },
              update: {
                feeAmount: new Decimal(feeData.feeAmount),
                accountId: feeData.accountId
              },
              create: {
                routeId: feeData.routeId,
                stopId: feeData.stopId,
                term: feeData.term,
                feeAmount: new Decimal(feeData.feeAmount),
                academicYearId: feeData.academicYearId,
                accountId: feeData.accountId
              }
            });

            createdFees.push(upsertedFee);
          }

          return createdFees;
        });

        res.status(200).json(result);
      } catch (error) {
        console.error('Transport Fee Creation Error:', error);
        res.status(400).json({ 
          error: 'An unknown error occurred',
            details: String(error) 
        });
      }
      break;
    }

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}

// Disable body parsing to allow larger payloads if needed
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
