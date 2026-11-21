import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

// Type definitions for request payload
interface RequestPayload {
  academicYearId: number;
  branchIds: number[];
  classIds: number[];
  sectionIds: number[];
  studentStatus?: string;
}

// Type definitions for response
interface ApiResponse {
  studentDetails: {
    admissionNo: string | null;
    applicationNo: string | null;
    rollNo: string | null;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    state: string | null;
    address: string | null;
    phoneNo: string | null; // Changed from bigint to string
    aadharNo: string | null; // Changed from bigint to string
    email: string | null;
    caste: string | null;
    bloodGroup: string | null;
    branch: string;
    class: string;
    section: string;
  };
  academicYearId: number;
  branchId: number;
  studentId: number;
  enrollmentId: number;
  feeCategory: string;
  status: string;
  hostelStatus: string;
  transportStatus: string;
}

// Helper function to safely convert BigInt to string
const serializeBigInt = (value: bigint | null): string | null => {
  return value ? value.toString() : null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse[] | { error: string; details?: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { academicYearId, branchIds, classIds, sectionIds, studentStatus }: RequestPayload = req.body;

    // Validate required fields
    if (!academicYearId || !branchIds || !classIds || !sectionIds) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Fetch the student enrollment data
    const enrollment = await prisma.studentEnrollment.findMany({
      where: {
        academicYearId: academicYearId,
        branchId: { in: branchIds },
        classId: { in: classIds },
        sectionId: { in: sectionIds },
        status: studentStatus || undefined,
      },
      select: {
        id: true,
        studentId: true,
        academicYearId: true,
        classId: true,
        sectionId: true,
        branchId: true,
        status: true,
        hostelStatus: true,
        transportStatus: true,
        feeCategoryId: true,
        student: {
          select: {
            admissionNo: true,
            applicationNo: true,
            rollNo: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            state: true,
            address: true,
            phoneNo: true,
            aadharNo: true,
            email: true,
            caste: true,
            bloodGroup: true,
          },
        },
        class: {
          select: { name: true },
        },
        section: {
          select: { name: true },
        },
        branch: {
          select: { name: true },
        },
        feeCategory: {
          select: { category: true },
        },
      },
    });

    if (!enrollment || enrollment.length === 0) {
      return res.status(404).json({ error: 'No enrollments found for the given filters' });
    }

    const responseData: ApiResponse[] = enrollment.map((enroll) => ({
      studentDetails: {
        admissionNo: enroll.student.admissionNo,
        applicationNo: enroll.student.applicationNo,
        rollNo: enroll.student.rollNo,
        firstName: enroll.student.firstName,
        lastName: enroll.student.lastName,
        dateOfBirth: enroll.student.dateOfBirth.toISOString(),
        state: enroll.student.state,
        address: enroll.student.address,
        phoneNo: serializeBigInt(enroll.student.phoneNo), // Convert BigInt to string
        aadharNo: serializeBigInt(enroll.student.aadharNo), // Convert BigInt to string
        email: enroll.student.email,
        caste: enroll.student.caste,
        bloodGroup: enroll.student.bloodGroup,
        branch: enroll.branch.name,
        class: enroll.class.name,
        section: enroll.section.name,
      },
      academicYearId: enroll.academicYearId,
      branchId: enroll.branchId,
      studentId: enroll.studentId,
      enrollmentId: enroll.id,
      feeCategory: enroll.feeCategory?.category || '',
      status: enroll.status,
      hostelStatus: enroll.hostelStatus,
      transportStatus: enroll.transportStatus,
    }));

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching student enrollment data:', error);
    return res.status(500).json({
      error: 'Failed to fetch student enrollment data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}