// app/api/attendance/section-wise/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface AttendanceData {
  [key: string]: {
    total: number;
    present: number;
    absent: number;
    leave: number;
    morningPresent: number;
    afternoonPresent: number;
    onDuty: number;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");
    const classId = searchParams.get("classId");
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    if (!branchId || !classId) {
      return NextResponse.json(
        { error: "Branch ID and Class ID are required" },
        { status: 400 }
      );
    }

    const sectionAttendance = await prisma.attendanceHeader.findMany({
      where: {
        branchId: parseInt(branchId),
        classId: parseInt(classId),
        date: new Date(date),
      },
      include: {
        section: true,
        details: {
          include: {
            enrollment: true,
          },
        },
      },
    });

    const formattedData = sectionAttendance.reduce<AttendanceData>(
      (acc, header) => {
        const details = header.details;

        acc[header.section.name] = {
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

        return acc;
      },
      {} as AttendanceData
    );

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching section-wise attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch section attendance data" },
      { status: 500 }
    );
  }
}
