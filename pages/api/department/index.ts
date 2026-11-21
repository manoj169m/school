import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    // Handle GET request - Retrieve a paginated list of departments
    case "GET":
      const { page = 1, limit = 10 } = req.query;
      const skip =
        (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
      const take = parseInt(limit as string, 10);

      try {
        const departments = await prisma.department.findMany({
          skip,
          take,
          include: { employees: true, auths: true }, // Include relations if needed
          orderBy: { name: "asc" }, // Optionally order by name
        });
        res.status(200).json(departments);
      } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ error: "Error fetching departments" });
      }
      break;

    // Handle POST request - Create a new department
    case "POST":
      const { name } = req.body;
      try {
        const newDepartment = await prisma.department.create({
          data: { name },
        });
        res.status(201).json(newDepartment);
      } catch (error) {
        console.error("Error creating department:", error);
        res.status(500).json({ error: "Error creating department" });
      }
      break;

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
