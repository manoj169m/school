// app/api/attendance/student-list/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isValidStatus, mapTypeToStatus } from "@/types/overall/attendance";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");
    const classId = searchParams.get("classId");
    const sectionId = searchParams.get("sectionId");
    const type = searchParams.get("type");
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    if (!branchId || !classId || !sectionId || !type) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const status = mapTypeToStatus(type);
    if (!isValidStatus(status)) {
      return NextResponse.json(
        { error: "Invalid attendance status" },
        { status: 400 }
      );
    }

    const attendanceDetails = await prisma.attendanceDetail.findMany({
      where: {
        header: {
          branchId: parseInt(branchId),
          classId: parseInt(classId),
          sectionId: parseInt(sectionId),
          date: new Date(date),
        },
        status: status,
      },
      include: {
        enrollment: {
          include: {
            student: true,
            class: true,
            section: true,
          },
        },
      },
    });

    const studentList = attendanceDetails.map((detail) => ({
      name: `${detail.enrollment.student.firstName} ${detail.enrollment.student.lastName}`.trim(),
      rollNo: detail.enrollment.student.rollNo || "",
      class: detail.enrollment.class.name,
      section: detail.enrollment.section.name,
    }));

    return NextResponse.json(studentList);
  } catch (error) {
    console.error("Error fetching student list:", error);
    return NextResponse.json(
      { error: "Failed to fetch student list" },
      { status: 500 }
    );
  }
}
