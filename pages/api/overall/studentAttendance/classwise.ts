// app/api/attendance/class-wise/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma,  } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    if (!branchId) {
      return NextResponse.json(
        { error: "Branch ID is required" },
        { status: 400 }
      );
    }

    const attendanceData = await prisma.attendanceHeader.findMany({
      where: {
        branchId: parseInt(branchId),
        date: new Date(date),
      },
      include: {
        class: true,
        details: {
          include: {
            enrollment: true,
          },
        },
      },
    });

    const classWiseAttendance = attendanceData.map((header) => {
      const details = header.details;

      return {
        class: header.class.name,
        total: header.totalStudents,
        present: details.filter((d) => d.status === "P").length,
        absent: details.filter((d) => d.status === "A").length,
        leave: details.filter((d) => d.status === "L").length,
        morningPresent: details.filter((d) =>
          ["P", "AN", "H"].includes(d.status)
        ).length,
        afternoonPresent: details.filter((d) =>
          ["P", "FN", "H"].includes(d.status)
        ).length,
        onDuty: details.filter((d) => d.status === "OD").length,
      };
    });

    return NextResponse.json(classWiseAttendance);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error:", error.message, error.code);
      return NextResponse.json(
        { error: `Database error: ${error.code}` },
        { status: 500 }
      );
    }

    console.error("Error fetching class-wise attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance data" },
      { status: 500 }
    );
  }
}
