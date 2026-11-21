// pages/api/events.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get the current academic year
    const currentAcademicYear = await prisma.academicYear.findFirst({
      where: {
        isCurrentYear: true,
      },
    });

    if (!currentAcademicYear) {
      return res.status(404).json({ error: "No current academic year found" });
    }

    // Get upcoming events for the current academic year
    const events = await prisma.event.findMany({
      where: {
        AND: [
          {
            date: {
              gte: currentAcademicYear.startDate,
              lte: currentAcademicYear.endDate,
            },
          },
          {
            date: {
              gte: new Date(), // Only get upcoming events
            },
          },
        ],
      },
      orderBy: {
        date: "asc",
      },
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ error: "Error fetching events" });
  }
}
