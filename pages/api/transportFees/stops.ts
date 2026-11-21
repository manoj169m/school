// pages/api/transportFees/stops.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { academicYearId, routeId } = req.body

      // Fetch stops for the specific route
      const stops = await prisma.stop.findMany({
        where: { routeId: Number(routeId) },
        orderBy: { stopNumber: 'asc' }
      })

      // Fetch transport fees for these stops
      const transportFees = await prisma.transportFee.findMany({
        where: {
          routeId: Number(routeId),
          academicYearId: Number(academicYearId)
        }
      })

      // Combine stops with their fees
      const stopsWithFees = stops.map(stop => {
        // Group fees by term for this stop
        const fees = transportFees
          .filter(fee => fee.stopId === stop.id)
          .reduce((acc, fee) => {
            acc[fee.term] = Number(fee.feeAmount)
            return acc
          }, {} as { [key: number]: number })

        return {
          ...stop,
          fees
        }
      })

      res.status(200).json(stopsWithFees)
    } catch (error) {
      console.error('Error fetching stops and fees:', error)
      res.status(500).json({ 
        error: 'Failed to fetch stops and fees', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}