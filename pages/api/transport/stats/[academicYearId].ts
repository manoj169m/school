// pages/api/transport/stats/[academicYearId].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const academicYearId = req.query.academicYearId;
    const branchId = Array.isArray(req.query.branchId)
      ? req.query.branchId[0]
      : req.query.branchId;

    if (!academicYearId || Array.isArray(academicYearId)) {
      return res.status(400).json({ message: "Invalid academic year ID" });
    }

    const academicYearIdNum = parseInt(academicYearId);

    // Validate academicYearId is a valid number
    if (isNaN(academicYearIdNum)) {
      return res
        .status(400)
        .json({ message: "Invalid academic year ID format" });
    }

    // Define base where conditions for enrollments
    const whereCondition: Prisma.StudentEnrollmentWhereInput = {
      academicYearId: academicYearIdNum,
      status: "Active",
      transportStatus: "Using",
    };

    // Add branch condition if specific branch is selected
    if (branchId && branchId !== "all") {
      const branchIdNum = parseInt(branchId);
      if (!isNaN(branchIdNum)) {
        whereCondition.branchId = branchIdNum;
      }
    }

    // Get all active enrollments with transport status
    const enrollments = await prisma.studentEnrollment.count({
      where: whereCondition,
    });

    // Get count of active transport routes
    const routesWhere: Prisma.RouteWhereInput = {
      academicYearId: academicYearIdNum,
    };

    const routes = await prisma.route.count({
      where: routesWhere,
    });

    // Get total stops being used
    const stopsWhere: Prisma.StopWhereInput = {
      transportAssignments: {
        some: {
          academicYearId: academicYearIdNum,
          status: "Using",
          ...(branchId && branchId !== "all" && !isNaN(parseInt(branchId))
            ? { studentEnrollment: { branchId: parseInt(branchId) } }
            : {}),
        },
      },
    };

    const uniqueStops = await prisma.stop.count({
      where: stopsWhere,
    });

    // Get transport assignments with their fees
    const assignmentsWhere: Prisma.TransportAssignmentWhereInput = {
      academicYearId: academicYearIdNum,
      status: "Using",
      NOT: {
        feeId: null,
      },
      ...(branchId && branchId !== "all" && !isNaN(parseInt(branchId))
        ? { studentEnrollment: { branchId: parseInt(branchId) } }
        : {}),
    };

    const assignments = await prisma.transportAssignment.findMany({
      where: assignmentsWhere,
      include: {
        transportFee: true,
      },
    });

    // Calculate total fees
    const totalFees = assignments.reduce((sum, assignment) => {
      if (assignment.transportFee?.feeAmount) {
        return sum + Number(assignment.transportFee.feeAmount);
      }
      return sum;
    }, 0);

    return res.status(200).json({
      totalStudents: enrollments,
      totalRoutes: routes,
      totalStops: uniqueStops,
      totalFees,
    });
  } catch (error) {
    console.error("Detailed Error:", error);
    return res.status(500).json({
      message: "Failed to fetch transport statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
