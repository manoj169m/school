import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { academicYearId, branchId, classId } = req.query;

      // Fetch Academic Years (if no other filters)
      if (!academicYearId) {
        const academicYears = await prisma.academicYear.findMany({
          select: {
            id: true,
            label: true,
          },
          orderBy: {
            label: "desc",
          },
        });
        return res.status(200).json(academicYears);
      }

      // Fetch Branches for selected Academic Year
      if (academicYearId && !branchId) {
        const branches = await prisma.branch.findMany({
          where: {
            branchClassSection: {
              some: {
                academicYearId: Number(academicYearId),
              },
            },
          },
          select: {
            id: true,
            name: true,
          },
          distinct: ["id"],
        });
        return res.status(200).json(branches);
      }

      // Fetch Classes fKor selected Academic Year and Branch
      if (academicYearId && branchId && !classId) {
        const classes = await prisma.class.findMany({
          where: {
            branchClassSection: {
              some: {
                academicYearId: Number(academicYearId),
                branchId: Number(branchId),
              },
            },
          },
          orderBy: {
            displayOrder: "asc",
          },
          select: {
            id: true,
            name: true,
          },
          distinct: ["id"],
        });
        return res.status(200).json(classes);
      }

      // Fetch Sections for selected Academic Year, Branch, and Class
      if (academicYearId && branchId && classId) {
        const sections = await prisma.section.findMany({
          where: {
            branchClassSection: {
              some: {
                academicYearId: Number(academicYearId),
                branchId: Number(branchId),
                classId: Number(classId),
              },
            },
          },
          orderBy: {
            displayOrder: "asc",
          },
          select: {
            id: true,
            name: true,
          },
          distinct: ["id"],
        });
        return res.status(200).json(sections);
      }

      // If no matching data found
      return res.status(200).json([]);
    } catch (error) {
      console.error("Error fetching cascading data:", error);
      res.status(500).json({
        error: "Failed to fetch cascading data",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
