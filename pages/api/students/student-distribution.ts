import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const academicYearId = Number(req.query.academicYearId);

  if (!academicYearId) {
    return res.status(400).json({ message: "Academic year ID is required" });
  }

  try {
    // Get all active enrollments for the selected academic year
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        academicYearId: academicYearId,
        status: "Active",
      },
      include: {
        student: {
          select: {
            gender: true,
          },
        },
      },
    });

    // Initialize counters
    const distribution = {
      hostel: {
        total: 0,
        boys: 0,
        girls: 0,
      },
      transport: {
        total: 0,
        boys: 0,
        girls: 0,
        routes: 0,
      },
      dayScholar: {
        total: 0,
        boys: 0,
        girls: 0,
      },
    };

    // Count students based on their usage status
    enrollments.forEach((enrollment) => {
      const isMale = enrollment.student.gender === "MALE";
    
      if (enrollment.hostelStatus === "Using") {
        distribution.hostel.total++;
        if (isMale) {
          distribution.hostel.boys++;
        } else {
          distribution.hostel.girls++;
        }
      } else if (enrollment.transportStatus === "Using") {
        distribution.transport.total++;
        if (isMale) {
          distribution.transport.boys++;
        } else {
          distribution.transport.girls++;
        }
      } else {
        distribution.dayScholar.total++;
        if (isMale) {
          distribution.dayScholar.boys++;
        } else {
          distribution.dayScholar.girls++;
        }
      }
    });
    

    // Get count of active transport routes for the selected academic year
    const activeRoutes = await prisma.route.count({
      where: {
        academicYearId: academicYearId,
      },
    });

    distribution.transport.routes = activeRoutes;

    return res.status(200).json(distribution);
  } catch (error) {
    console.error("Error fetching student distribution:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
