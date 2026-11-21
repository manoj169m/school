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
    const branchId = Array.isArray(req.query.branchId)
      ? req.query.branchId[0]
      : req.query.branchId;

    // Define where clause based on branchId
    const where =
      branchId && branchId !== "all" ? { branchId: parseInt(branchId) } : {};

    // Add validation for branchId if it exists
    if (branchId && branchId !== "all" && isNaN(parseInt(branchId))) {
      return res.status(400).json({ error: "Invalid branch ID format" });
    }

    // Fetch vehicles with optional branch filter
    const vehicles = await prisma.vehicle.findMany({
      where,
      select: {
        id: true,
        vehicleNumber: true,
        driverName: true,
        contactNumber: true,
        capacity: true,
      },
    });

    return res.status(200).json({
      vehicles,
      totalCount: vehicles.length,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return res.status(500).json({ error: "Error fetching vehicles" });
  }
}
