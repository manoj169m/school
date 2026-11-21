import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { branchId } = req.query;

  try {
    const whereClause = {
      status: 'Active',
      ...(branchId && branchId !== 'all' ? { branchId: parseInt(branchId as string) } : {}),
    };

    const [totalCount, boysCount, girlsCount] = await Promise.all([
      // Total students count
      prisma.studentEnrollment.count({
        where: {
          ...whereClause,
        },
      }),
      // Boys count
      prisma.studentEnrollment.count({
        where: {
          ...whereClause,
          student: {
            gender: 'MALE',
          },
        },
      }),
      // Girls count
      prisma.studentEnrollment.count({
        where: {
          ...whereClause,
          student: {
            gender: 'FEMALE',
          },
        },
      }),
    ]);

    return res.status(200).json({
      total: totalCount,
      boys: boysCount,
      girls: girlsCount,
    });
  } catch (error) {
    console.error('Error fetching student counts:', error);
    return res.status(500).json({ message: 'Error fetching student counts' });
  }
}