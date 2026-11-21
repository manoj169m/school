import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    // Handle GET request - Retrieve a paginated list of designations
    case "GET":
      const { page = 1, limit = 10 } = req.query;
      const skip =
        (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
      const take = parseInt(limit as string, 10);

      try {
        const designations = await prisma.designation.findMany({
          skip,
          take,
          include: { employees: true, auths: true }, // Include relations if needed
          orderBy: { title: "asc" }, // Optionally order by title
        });
        res.status(200).json(designations);
      } catch (error) {
        console.error("Error fetching designations:", error);
        res.status(500).json({ error: "Error fetching designations" });
      }
      break;

    // Handle POST request - Create a new designation
    case "POST":
      const { title } = req.body;
      try {
        const newDesignation = await prisma.designation.create({
          data: { title },
        });
        res.status(201).json(newDesignation);
      } catch (error) {
        console.error("Error creating designation:", error);
        res.status(500).json({ error: "Error creating designation" });
      }
      break;

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
