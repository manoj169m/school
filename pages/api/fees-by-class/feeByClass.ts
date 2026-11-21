import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

// Type to handle BigInt serialization
type Serializable = string | number | boolean | null | Serializable[] | { [key: string]: Serializable };

// Function to serialize BigInt fields to strings
function serializeBigInt(value: unknown): Serializable {
  if (typeof value === 'bigint') {
    return value.toString(); // Convert BigInt to string
  } else if (Array.isArray(value)) {  
    return value.map(serializeBigInt) as Serializable; // Recursively handle arrays
  } else if (value && typeof value === 'object') {
    const result: Record<string, Serializable> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = serializeBigInt((value as Record<string, unknown>)[key]); // Recursively handle objects
      }
    }
    return result;
  }
  return value as Serializable; // Return non-BigInt values as they are
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { academicYearId, branchId, classId, sectionId, feeCategoryId } = req.body;

    console.log('Received request body:', req.body); // Log incoming request data

    // Validate input data (ensure all values are numbers)
    if (
      [academicYearId, branchId, classId, sectionId, feeCategoryId].some(
        (value) => typeof value !== 'number' || isNaN(value)
      )
    ) {
      return res.status(400).json({ error: 'Invalid input. All values must be numbers.' });
    }

    try {
      const feeByClasses = await prisma.feeByClass.findMany({
        where: {
          academicYearId,
          branchId,
          classId,
          sectionId,
          feeCategoryId,
        },
        include: {
          account: true,
          class: true,
          section: true,
          branch: true,
          academicYear: true,
          feeCategory: true,
        },
      });

      console.log('Fetched FeeByClass records:', feeByClasses); // Log the fetched data

      if (!feeByClasses.length) {
        return res.status(404).json({ message: 'No matching records found' });
      }

      // Serialize BigInt fields before sending the response
      const serializedData = feeByClasses.map(serializeBigInt);

      res.status(200).json(serializedData); // S  end serialized data
    } catch (error) {
      console.error('Error fetching FeeByClass data:', error);
      res.status(500).json({ error: 'Failed to fetch FeeByClass data. Check server logs.' });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
