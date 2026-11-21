
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const branchId = searchParams.get("branchId");
    const academicYearId = searchParams.get("academicYearId");
    const status = searchParams.get("status");

    if (!branchId || !academicYearId || !status) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        branchId: parseInt(branchId),
        academicYearId: parseInt(academicYearId),
        status: status,
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            communicationNo: true,
            phoneNo: true,
          }
        },
        class: {
          select: {
            name: true,
          }
        },
        section: {
          select: {
            name: true,
          }
        }
      },
    });

    // Transform the data to match the StudentOption interface
    const formattedStudents = enrollments.map((enrollment) => ({
      value: enrollment.id.toString(),
      label: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
      details: {
        class: enrollment.class.name,
        section: enrollment.section.name,
        fatherName: "", // Add if you have this field in your schema
        communicationNo: enrollment.student.communicationNo?.toString() || "",
        phoneNo: enrollment.student.phoneNo?.toString() || "",
      },
    }));

    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { enrollmentId, status } = body;

    if (!enrollmentId) {
      return NextResponse.json(
        { error: "Enrollment ID is required" },
        { status: 400 }
      );
    }

    // Update the student enrollment
    const updatedEnrollment = await prisma.studentEnrollment.update({
      where: {
        id: parseInt(enrollmentId),
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedEnrollment);
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}