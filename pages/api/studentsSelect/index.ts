// pages/api/studentsSelect.ts
import  prisma  from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from 'next';

// In pages/api/studentsSelect.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { academicYearId, status } = req.query;
    console.log('Query params:', { academicYearId, status }); // Debug log

    if (!academicYearId || !status) {
      return res.status(400).json({ error: "Academic year and status are required" });
    }

    // Fetch students with their enrollment and related information
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        academicYearId: parseInt(academicYearId as string),
        status: status as string,
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            communicationNo: true,
            phoneNo: true,
            relationName1: true,
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
      }
    });

    console.log('Found enrollments:', enrollments); // Debug log

    const formattedStudents = enrollments.map((enrollment) => ({
      value: enrollment.id.toString(),
      label: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
      details: {
        class: enrollment.class.name,
        section: enrollment.section.name,
        fatherName: enrollment.student.relationName1 || '',
        communicationNo: enrollment.student.communicationNo?.toString() || '',
        phoneNo: enrollment.student.phoneNo?.toString() || '',
      },
    }));

    console.log('Formatted students:', formattedStudents); // Debug log
    return res.status(200).json(formattedStudents);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "Failed to fetch students" });
  }
}