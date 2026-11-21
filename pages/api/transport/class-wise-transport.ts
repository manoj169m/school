//transport api

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

// Define TypeScript interfaces for our data structures

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const branchId = Array.isArray(req.query.branchId)
      ? req.query.branchId[0]
      : req.query.branchId;

    // Add validation for branchId if it exists
    if (branchId && branchId !== "all" && isNaN(parseInt(branchId))) {
      return res.status(400).json({ error: "Invalid branch ID format" });
    }

    // Get current academic year
    const currentAcademicYear = await prisma.academicYear.findFirst({
      where: {
        isCurrentYear: true,
      },
    });

    if (!currentAcademicYear) {
      return res.status(404).json({ error: "Current academic year not found" });
    }

    // Build the where clause for branch filtering
    const branchFilter =
      branchId && branchId !== "all" ? { branchId: parseInt(branchId) } : {};

    // Fetch classes and their enrollments
    const classData = await prisma.class.findMany({
      where: {
        enrollments: {
          some: {
            academicYearId: currentAcademicYear.id,
            ...branchFilter,
            transportStatus: "Using",
          },
        },
      },
      select: {
        id: true,
        name: true,
        acronym: true,
        enrollments: {
          where: {
            academicYearId: currentAcademicYear.id,
            ...branchFilter,
            transportStatus: "Using",
          },
          select: {
            id: true,
            sectionId: true,
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                relationNo1: true,
                rollNo: true,
              },
            },
            section: {
              select: {
                id: true,
                name: true,
              },
            },
            transportAssignments: {
              where: {
                status: "Using",
                academicYearId: currentAcademicYear.id,
              },
              select: {
                route: {
                  select: {
                    routeName: true,
                    vehicle: {
                      select: {
                        vehicleNumber: true,
                      },
                    },
                  },
                },
                stop: {
                  select: {
                    stopName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    // Transform the data to the expected format
    const transformedData = classData.map((classInfo) => {
      // Group enrollments by section
      const sectionMap = new Map<
        number,
        {
          id: number;
          name: string;
          students: Array<{
            id: number;
            name: string;
            rollNo: string;
            fatherContact: string;
            transportType: string;
            route: string;
            vehicleNumber: string;
            stop: string;
          }>;
        }
      >();

      classInfo.enrollments.forEach((enrollment) => {
        const sectionId = enrollment.section.id;

        if (!sectionMap.has(sectionId)) {
          sectionMap.set(sectionId, {
            id: sectionId,
            name: enrollment.section.name,
            students: [],
          });
        }

        const section = sectionMap.get(sectionId)!;
        section.students.push({
          id: enrollment.student.id,
          name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
          rollNo: enrollment.student.rollNo || "",
          fatherContact: enrollment.student.relationNo1?.toString() || "",
          transportType: "bus",
          route: enrollment.transportAssignments[0]?.route.routeName || "",
          vehicleNumber:
            enrollment.transportAssignments[0]?.route.vehicle.vehicleNumber ||
            "",
          stop: enrollment.transportAssignments[0]?.stop.stopName || "",
        });
      });

      return {
        id: classInfo.id,
        name: classInfo.name,
        acronym: classInfo.acronym,
        totalStudents: classInfo.enrollments.length,
        sections: Array.from(sectionMap.values()),
      };
    });

    return res.status(200).json({
      classes: transformedData,
      totalStudents: transformedData.reduce(
        (acc, classInfo) => acc + classInfo.totalStudents,
        0
      ),
    });
  } catch (error) {
    console.error("Error fetching class-wise transport data:", error);
    return res
      .status(500)
      .json({ error: "Error fetching class-wise transport data" });
  }
}
