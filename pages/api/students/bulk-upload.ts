import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

// Updated Zod Schema to match single student registration
const numberToString = (val: unknown) => {
  if (typeof val === 'number') {
    return val.toString();
  }
  return val;
};

const studentCreationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.union([z.literal("MALE"), z.literal("FEMALE"), z.literal("OTHER")]),
  dateOfBirth: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  community: z.string().optional(),
  caste: z.string().optional(),
  bloodGroup: z.string().optional(),
  motherTongue: z.string().optional(),
  religion: z.string().optional(),

  aadharNo: z.string().optional(),
  emisNo: z.string().optional(),
  placeOfBirth: z.string().optional(),

  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  cityTownVillage: z.string().min(1, "City/Town/Village is required"),
  address: z.string().min(1, "Address is required"),

  communicationNo: z.string().min(1, "Communication number is required"),
  phoneNo: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email format").optional(),

  relationName1: z.string().min(1, "Primary relation name is required"),
  relationType1: z.string().min(1, "Primary relation type is required"),
  relationNo1: z.string().min(1, "Primary relation number is required"),
  relationName2: z.string().optional(),
  relationType2: z.string().optional(),
  relationNo2: z.string().optional(),

  // Updated fields to handle both string and number inputs
  academicYear: z.preprocess(
    numberToString,
    z.string().min(1, "Academic year is required")
  ),
  branch: z.preprocess(
    numberToString,
    z.string().min(1, "Branch is required")
  ),
  joinYear: z.preprocess(
    numberToString,
    z.string().min(1, "Join year is required")
  ),
  dateOfJoin: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid join date format",
    })
  ),
  classJoin: z.preprocess(
    numberToString,
    z.string().min(1, "Class join is required")
  ),
  class: z.preprocess(
    numberToString,
    z.string().min(1, "Class is required")
  ),
  section: z.preprocess(
    numberToString,
    z.string().min(1, "Section is required")
  ),

  admissionNo: z.string().min(1, "Admission number is required"),
  applicationNo: z.string().optional(),
  rollNo: z.string().optional(),

  feeCategory: z.preprocess(
    numberToString,
    z.string().min(1, "Fee category is required")
  ),
  transport: z.enum(["Using", "NotUsing"]),
  hostel: z.enum(["Using", "NotUsing"]),

  routeName: z.preprocess(numberToString, z.string().optional()),
  stopName: z.preprocess(numberToString, z.string().optional()),
  hostelName: z.preprocess(numberToString, z.string().optional()),
  floorName: z.preprocess(numberToString, z.string().optional()),
});

const bulkStudentUploadSchema = studentCreationSchema.array();

type StudentData = z.infer<typeof studentCreationSchema>;

const preprocessStudentData = (data: StudentData[]) => {
  return data.map((record) => ({
    ...record,
    dateOfBirth: record.dateOfBirth ? new Date(record.dateOfBirth) : null,
    dateOfJoin: record.dateOfJoin ? new Date(record.dateOfJoin) : null,
    communicationNo: record.communicationNo?.toString(),
    phoneNo: record.phoneNo?.toString(),
    relationNo1: record.relationNo1?.toString(),
    relationNo2: record.relationNo2 ? record.relationNo2.toString() : null,
    branch: record.branch?.toString(),
    feeCategory: record.feeCategory?.toString(),
    class: record.class?.toString(),
    section: record.section?.toString(),
    admissionNo: record.admissionNo?.toString(),
    rollNo: record.rollNo?.toString(),
    aadharNo: record.aadharNo?.toString(),
    emisNo: record.emisNo?.toString(),
    applicationNo: record.applicationNo?.toString(),
    routeName: record.routeName?.toString(),
    stopName: record.stopName?.toString(),
    hostelName: record.hostelName?.toString(),
    floorName: record.floorName?.toString(),
  }));
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const normalizedData = preprocessStudentData(req.body);
    const validatedData = bulkStudentUploadSchema.parse(normalizedData);

    type FailedResult = {
      index: number;
      errors: Array<{ message: string; path?: string[] }>;
    };

    const results: {
      successful: number[];
      failed: FailedResult[];
    } = { successful: [], failed: [] };

    for (let index = 0; index < validatedData.length; index++) {
      const studentData = validatedData[index];

      try {
        const result = await prisma.$transaction(async (prisma) => {
          // 1. Create Person record
          const person = await prisma.person.create({
            data: {
              firstName: studentData.firstName,
              lastName: studentData.lastName,
              email: studentData.email || '',
              role: 'student'
            }
          });

          // 2. Create Student record
          const student = await prisma.student.create({
            data: {
              personId: person.id,
              admissionNo: studentData.admissionNo,
              applicationNo: studentData.applicationNo,
              rollNo: studentData.rollNo || `SKV-${studentData.admissionNo}`,
              firstName: studentData.firstName,
              lastName: studentData.lastName,
              gender: studentData.gender,
              dateOfBirth: studentData.dateOfBirth,
              placeOfBirth: studentData.placeOfBirth || '',
              country: studentData.country,
              state: studentData.state,
              cityTownVillage: studentData.cityTownVillage,
              address: studentData.address,
              communicationNo: BigInt(studentData.communicationNo.replace(/\+|\s/g, '')),
              phoneNo: BigInt(studentData.phoneNo.replace(/\+|\s/g, '')),
              email: studentData.email,
              aadharNo: studentData.aadharNo ? BigInt(studentData.aadharNo) : null,
              emisNo: studentData.emisNo,
              community: studentData.community,
              caste: studentData.caste,
              bloodGroup: studentData.bloodGroup,
              motherTongue: studentData.motherTongue,
              religion: studentData.religion,
              relationName1: studentData.relationName1,
              relationType1: studentData.relationType1,
              relationNo1: BigInt(studentData.relationNo1.replace(/\+|\s/g, '')),
              relationName2: studentData.relationName2,
              relationType2: studentData.relationType2,
              relationNo2: studentData.relationNo2 ? BigInt(studentData.relationNo2.replace(/\+|\s/g, '')) : null
            }
          });

          // 3. Create StudentEnrollment record
          const enrollment = await prisma.studentEnrollment.create({
            data: {
              studentId: student.id,
              academicYearId: parseInt(studentData.academicYear),
              classId: parseInt(studentData.class),
              sectionId: parseInt(studentData.section),
              feeCategoryId: parseInt(studentData.feeCategory),
              branchId: parseInt(studentData.branch),
              hostelStatus: studentData.hostel,
              transportStatus: studentData.transport,
              enrollmentDate: studentData.dateOfJoin,
              status: 'Active'
            }
          });

          // 4. Create StudentFee record
          await prisma.studentFee.create({
            data: {
              enrollmentId: enrollment.id,
              totalFee: 0,
              concession: 0,
              individualFee: 0,
              finalFee: 0,
              paidAmount: 0,
              balanceAmount: 0
            }
          });

         // 5. Create Transport Assignment if needed
if (studentData.transport === "Using" && studentData.routeName && studentData.stopName) {
  const routeId = parseInt(studentData.routeName);
  const stopId = parseInt(studentData.stopName);
  const academicYearId = parseInt(studentData.academicYear);

  // Try to find transport fee if it exists
  const transportFee = await prisma.transportFee.findFirst({
    where: {
      routeId: routeId,
      stopId: stopId,
      academicYearId: academicYearId,
      term: 1
    }
  });

  // Create transport assignment with or without fee
  await prisma.transportAssignment.create({
    data: {
      enrollmentId: enrollment.id,
      routeId: routeId,
      stopId: stopId,
      academicYearId: academicYearId,
      startDate: new Date(),
      term: 1,
      status: 'Using',
      ...(transportFee && { feeId: transportFee.id }) // Include feeId only if fee exists
    }
  });
}

// 6. Create Hostel Assignment if needed
if (studentData.hostel === "Using" && studentData.hostelName && studentData.floorName) {
  const hostelId = parseInt(studentData.hostelName);
  const roomId = parseInt(studentData.floorName);
  const academicYearId = parseInt(studentData.academicYear);

  // Try to find hostel fee if it exists
  const hostelFee = await prisma.hostelFee.findFirst({
    where: {
      hostelId: hostelId,
      academicYearId: academicYearId
    }
  });

  // Create hostel assignment with or without fee
  await prisma.hostelAssignment.create({
    data: {
      enrollmentId: enrollment.id,
      hostelId: hostelId,
      roomId: roomId,
      academicYearId: academicYearId,
      startDate: studentData.dateOfJoin,
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      term: 1,
      status: 'Using',
      ...(hostelFee && { feeId: hostelFee.id }) // Include feeId only if fee exists
    }
  });
}

          // 7. Create StudentAuth record
          const hashedPassword = await bcrypt.hash(studentData.phoneNo, 10);
          await prisma.studentAuth.create({
            data: {
              studentId: student.id,
              username: studentData.email || studentData.phoneNo,
              password: hashedPassword
            }
          });

          return { studentId: student.id, enrollmentId: enrollment.id };
        });

        results.successful.push(result.studentId);
      } catch (error) {
        results.failed.push({
          index,
          errors: error instanceof z.ZodError
            ? error.errors.map((e) => ({
                message: e.message,
                path: e.path.filter((p) => typeof p === 'string') as string[],
              }))
            : [{ message: error instanceof Error ? error.message : 'Unknown error occurred' }],
        });
      }
    }

    res.status(200).json({
      message: 'Bulk upload processed',
      successful: results.successful.length,
      failed: results.failed.length,
      details: results,
    });
  } catch (error) {
    console.error('Bulk Student Registration Error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({
          error: 'Duplicate Entry',
          details: 'A student with this email or other unique identifier already exists'
        });
      }
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}