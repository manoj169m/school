import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const branchId = parseInt(req.query.branchId as string);
  const academicYearId = parseInt(req.query.academicYearId as string);

  if (!branchId || !academicYearId) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    // Get unique classes in the branch for the academic year
    const classes = await prisma.branchClassSection.findMany({
      where: {
        branchId: branchId,
        academicYearId: academicYearId,
      },
      select: {
        classId: true,
        class: {
          select: {
            id: true,
            name: true,
            displayOrder: true,
          },
        },
      },
      distinct: ['classId'],
      orderBy: {
        class: {
          displayOrder: 'asc',
        },
      },
    });

    // Get student count for each class
    const classWiseData = await Promise.all(
      classes.map(async ({ class: classInfo }) => {
        const totalStudents = await prisma.studentEnrollment.count({
          where: {
            academicYearId: academicYearId,
            branchId: branchId,
            classId: classInfo.id,
            status: "Active",
          },
        });

        return {
          classId: classInfo.id,
          className: classInfo.name,
          totalStudents: totalStudents,
        };
      })
    );

    return res.status(200).json(classWiseData);
  } catch (error) {
    console.error("Error fetching branch classes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}