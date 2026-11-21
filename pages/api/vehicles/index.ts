import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    // Retrieve all vehicles with pagination
    case "GET": {
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      try {
        const vehicles = await prisma.vehicle.findMany({
          skip,
          take,
          select: {
            id: true,
            vehicleNumber: true,
            driverName: true,
            contactNumber: true,
            chassisNo: true,
            engineNo: true,
            modal: true,
            mielage: true,
            capacity: true,
            regNo: true,
            branch: {
              select: {
                id: true,
                name: true, // Adjust based on the fields available in the Branch model
              },
            },
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { vehicleNumber: "asc" },
        });
        res.status(200).json(vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ error: "Error fetching vehicles" });
      }
      break;
    }

    // Create a new vehicle
    case "POST": {
      const {
        vehicleNumber,
        driverName,
        contactNumber,
        chassisNo,
        engineNo,
        modal,
        mielage,
        capacity,
        branchId,
        regNo,
      } = req.body;

      try {
        const newVehicle = await prisma.vehicle.create({
          data: {
            vehicleNumber,
            driverName,
            contactNumber,
            chassisNo,
            engineNo,
            modal,
            mielage,
            capacity,
            regNo,
            branch: {
              connect: { id: branchId },
            },
          },
        });
        res.status(201).json(newVehicle);
      } catch (error) {
        console.error("Error creating vehicle:", error);
        res.status(500).json({ error: "Error creating vehicle" });
      }
      break;
    }

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}



