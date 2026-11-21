import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      try {
        const branches = await prisma.branch.findMany({
          skip,
          take,
          select: {
            id: true,
            name: true,
            acronym: true,
            label: true,
            inCharge: true,
            contact: true,
            address: true,
            location: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            name: "asc", // Optionally, order by branch name
          },
        });

        // Convert BigInt fields to string
        const safeBranches = branches.map((branch) => ({
          ...branch,
          contact: branch.contact ? branch.contact.toString() : null, // Convert BigInt to string
        }));

        res.status(200).json(safeBranches); // Send the modified data
      } catch (error) {
        console.error("Error fetching branches:", error);
        res.status(500).json({ error: "Error fetching branches" });
      }
      break;

    case "POST":
      const { name, acronym, label, inCharge, contact, address, location } =
        req.body;
      try {
        const newBranch = await prisma.branch.create({
          data: {
            name,
            acronym,
            label,
            inCharge,
            contact,
            address,
            location,
          },
        });
        res.status(201).json(newBranch);
      } catch (error) {
        console.error("Error creating branch:", error);
        res.status(500).json({ error: "Error creating branch" });
      }
      break;

    default:
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      break;
  }
}
