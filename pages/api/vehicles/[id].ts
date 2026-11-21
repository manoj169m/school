import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Ensure `id` is valid
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid or missing vehicle ID" });
  }

  const vehicleId = parseInt(id as string);

  switch (req.method) {
    // Retrieve a single vehicle by ID
    case "GET": {
      try {
        const vehicle = await prisma.vehicle.findUnique({
          where: { id: vehicleId },
        });
        if (!vehicle) {
          return res.status(404).json({ error: "Vehicle not found" });
        }
        res.status(200).json(vehicle);
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        res.status(500).json({ error: "Error fetching vehicle" });
      }
      break;
    }

    // Update a vehicle by ID
    case "PUT": {
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

      // Validate required fields
      if (
        !vehicleNumber ||
        !chassisNo ||
        !engineNo ||
        !modal ||
        !mielage ||
        typeof capacity !== "number" ||
        !regNo ||
        !branchId
      ) {
        return res
          .status(400)
          .json({ error: "Missing or invalid required fields" });
      }

      try {
        const updatedVehicle = await prisma.vehicle.update({
          where: { id: vehicleId },
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
            branchId,
          },
        });
        res.status(200).json(updatedVehicle);
      } catch (error) {
        console.error("Error updating vehicle:", error);
        res.status(500).json({ error: "Error updating vehicle" });
      }
      break;
    }

    // Delete a vehicle by ID
    case "DELETE": {
      try {
        await prisma.vehicle.delete({
          where: { id: vehicleId },
        });
        res.status(204).end(); // 204 No Content
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        res.status(500).json({ error: "Error deleting vehicle" });
      }
      break;
    }

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
