import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { academicYearId, status, branchId } = req.query;

    if (!academicYearId || !status) {
      return res.status(400).json({
        error: "Academic year and status are required",
      });
    }

    // Build the where clause based on whether branchId is 'all' or a specific ID
    const whereClause = {
      academicYearId: parseInt(academicYearId as string),
      status: status as string,
      ...(branchId !== "all" && { branchId: parseInt(branchId as string) }),
    };

    const enrollments = await prisma.studentEnrollment.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            communicationNo: true,
            phoneNo: true,
            relationName1: true,
          },
        },
        class: {
          select: {
            name: true,
          },
        },
        section: {
          select: {
            name: true,
          },
        },
        branch: {
          select: {
            acronym: true,
          },
        },
      },
      orderBy: [
        {
          branchId: "asc",
        },
        {
          student: {
            firstName: "asc",
          },
        },
      ],
    });

    const formattedStudents = enrollments.map((enrollment) => ({
      value: enrollment.id.toString(),
      label: `${enrollment.student.firstName} ${enrollment.student.lastName} ${
        branchId === "all" ? `(${enrollment.branch.acronym})` : ""
      }`,
      details: {
        class: enrollment.class.name,
        section: enrollment.section.name,
        fatherName: enrollment.student.relationName1 || "",
        communicationNo: enrollment.student.communicationNo?.toString() || "",
        phoneNo: enrollment.student.phoneNo?.toString() || "",
        branchId: enrollment.branchId,
      },
    }));

    return res.status(200).json(formattedStudents);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "Failed to fetch students" });
  }
}
