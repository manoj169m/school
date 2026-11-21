// pages/api/transport/overview.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get total number of vehicles (buses)
    const totalBuses = await prisma.vehicle.count();

    // Get total number of routes
    const totalRoutes = await prisma.route.count();

    // Get total number of students using transport by checking studentEnrollment
    const totalStudents = await prisma.studentEnrollment.count({
      where: {
        status: "Active",
        transportStatus: "Using",
      },
    });

    return res.status(200).json({
      buses: totalBuses,
      routes: totalRoutes,
      totalStudents,
    });
  } catch (error) {
    console.error("Error fetching transport overview:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
