import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  switch (req.method) {
    // Handle GET request - Retrieve a single department by ID
    case "GET":
      try {
        const department = await prisma.department.findUnique({
          where: { id: parseInt(id as string, 10) },
          include: { employees: true, auths: true }, // Include relations if needed
        });
        if (!department) {
          return res.status(404).json({ error: "Department not found" });
        }
        res.status(200).json(department);
      } catch (error) {
        console.error("Error fetching department:", error);
        res.status(500).json({ error: "Error fetching department" });
      }
      break;

    // Handle PUT request - Update a department by ID
    case "PUT":
      const { name } = req.body;
      try {
        const updatedDepartment = await prisma.department.update({
          where: { id: parseInt(id as string, 10) },
          data: { name },
        });
        res.status(200).json(updatedDepartment);
      } catch (error) {
        console.error("Error updating department:", error);
        res.status(500).json({ error: "Error updating department" });
      }
      break;

    // Handle DELETE request - Delete a department by ID
    case "DELETE":
      try {
        await prisma.department.delete({
          where: { id: parseInt(id as string, 10) },
        });
        res.status(204).json({ message: "Department deleted successfully" });
      } catch (error) {
        console.error("Error deleting department:", error);
        res.status(500).json({ error: "Error deleting department" });
      }
      break;

    // Handle unsupported methods
    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
