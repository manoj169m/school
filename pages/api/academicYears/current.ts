import type { NextApiRequest, NextApiResponse } from 'next';
import  prisma  from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const currentAcademicYear = await prisma.academicYear.findFirst({
      where: {
        isCurrentYear: true,
      },
      select: {
        id: true,
        label: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!currentAcademicYear) {
      return res.status(404).json({ error: "No current academic year found" });
    }

    return res.status(200).json(currentAcademicYear);
  } catch (error) {
    console.error("Error fetching current academic year:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
