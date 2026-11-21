import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  switch (req.method) {
    // Handle GET request - Retrieve a single designation by ID
    case "GET":
      try {
        const designation = await prisma.designation.findUnique({
          where: { id: parseInt(id as string, 10) },
          include: { employees: true, auths: true }, // Include relations if needed
        });
        if (!designation) {
          return res.status(404).json({ error: "Designation not found" });
        }
        res.status(200).json(designation);
      } catch (error) {
        console.error("Error fetching designation:", error);
        res.status(500).json({ error: "Error fetching designation" });
      }
      break;

    // Handle PUT request - Update a designation by ID
    case "PUT":
      const { title } = req.body;
      try {
        const updatedDesignation = await prisma.designation.update({
          where: { id: parseInt(id as string, 10) },
          data: { title },
        });
        res.status(200).json(updatedDesignation);
      } catch (error) {
        console.error("Error updating designation:", error);
        res.status(500).json({ error: "Error updating designation" });
      }
      break;

    // Handle DELETE request - Delete a designation by ID
    case "DELETE":
      try {
        await prisma.designation.delete({
          where: { id: parseInt(id as string, 10) },
        });
        res.status(204).json({ message: "Designation deleted successfully" });
      } catch (error) {
        console.error("Error deleting designation:", error);
        res.status(500).json({ error: "Error deleting designation" });
      }
      break;

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
