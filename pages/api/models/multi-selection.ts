import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { academicYearId, branchIds, classIds } = req.query;

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
        return res.status(200).json(
          academicYears.map(year => ({
            value: year.id.toString(),
            label: year.label
          }))
        );
      }

      // Fetch Branches for selected Academic Year
      if (academicYearId && !branchIds) {
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
        return res.status(200).json(
          branches.map(branch => ({
            value: branch.id.toString(),
            label: branch.name
          }))
        );
      }

      // Fetch Classes for selected Academic Year and Branches
      if (academicYearId && branchIds && !classIds) {
        const branchIdsArray = Array.isArray(branchIds) 
          ? branchIds.map(Number)
          : [Number(branchIds)];

        const classes = await prisma.class.findMany({
          where: {
            branchClassSection: {
              some: {
                academicYearId: Number(academicYearId),
                branchId: {
                  in: branchIdsArray
                }
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
        return res.status(200).json(
          classes.map(cls => ({
            value: cls.id.toString(),
            label: cls.name
          }))
        );
      }

      // Fetch Sections for selected Academic Year, Branches, and Classes
      if (academicYearId && branchIds && classIds) {
        const branchIdsArray = Array.isArray(branchIds) 
          ? branchIds.map(Number)
          : [Number(branchIds)];
        const classIdsArray = Array.isArray(classIds) 
          ? classIds.map(Number)
          : [Number(classIds)];

        const sections = await prisma.section.findMany({
          where: {
            branchClassSection: {
              some: {
                academicYearId: Number(academicYearId),
                branchId: {
                  in: branchIdsArray
                },
                classId: {
                  in: classIdsArray
                }
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
        return res.status(200).json(
          sections.map(section => ({
            value: section.id.toString(),
            label: section.name
          }))
        );
      }

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