// pages/api/students/register.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Zod Schema for Student Creation
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

  academicYear: z.string().min(1, "Academic year is required"),
  branch: z.string().min(1, "Branch is required"),
  joinYear: z.string().min(1, "Join year is required"),
  dateOfJoin: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid join date format",
    })
  ),
  classJoin: z.string().min(1, "Class join is required"),
  class: z.string().min(1, "Class is required"),
  section: z.string().min(1, "Section is required"),

  admissionNo: z.string().min(1, "Admission number is required"),
  applicationNo: z.string().optional(),
  rollNo: z.string().optional(),

  feeCategory: z.string().min(1, "Fee category is required"),
  transport: z.enum(["Using", "NotUsing"]),
  hostel: z.enum(["Using", "NotUsing"]),

  // For transport and hostel details
  routeName: z.string().optional(),
  stopName: z.string().optional(),
  hostelName: z.string().optional(),
  floorName: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const validatedData = studentCreationSchema.parse(req.body);

    const result = await prisma.$transaction(async (prisma) => {
      // 1. Create Person record
      const person = await prisma.person.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email || '',
          role: 'student'
        }
      });

      // 2. Create Student record
      const student = await prisma.student.create({
        data: {
          personId: person.id,
          admissionNo: validatedData.admissionNo,
          applicationNo: validatedData.applicationNo,
          rollNo: validatedData.rollNo,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          gender: validatedData.gender,
          dateOfBirth: validatedData.dateOfBirth,
          placeOfBirth: validatedData.placeOfBirth || '',
          country: validatedData.country,
          state: validatedData.state,
          cityTownVillage: validatedData.cityTownVillage,
          address: validatedData.address,
          communicationNo: BigInt(validatedData.communicationNo.replace(/\+|\s/g, '')),
          phoneNo: BigInt(validatedData.phoneNo.replace(/\+|\s/g, '')),
          email: validatedData.email,
          aadharNo: validatedData.aadharNo ? BigInt(validatedData.aadharNo) : null,
          emisNo: validatedData.emisNo,
          community: validatedData.community,
          caste: validatedData.caste,
          bloodGroup: validatedData.bloodGroup,
          motherTongue: validatedData.motherTongue,
          religion: validatedData.religion,
          relationName1: validatedData.relationName1,
          relationType1: validatedData.relationType1,
          relationNo1: BigInt(validatedData.relationNo1.replace(/\+|\s/g, '')),
          relationName2: validatedData.relationName2,
          relationType2: validatedData.relationType2,
          relationNo2: validatedData.relationNo2 ? BigInt(validatedData.relationNo2.replace(/\+|\s/g, '')) : null
        }
      });

      // 3. Create StudentEnrollment record
      const enrollment = await prisma.studentEnrollment.create({
        data: {
          studentId: student.id,
          academicYearId: parseInt(validatedData.academicYear),
          classId: parseInt(validatedData.class),
          sectionId: parseInt(validatedData.section),
          feeCategoryId: parseInt(validatedData.feeCategory),
          branchId: parseInt(validatedData.branch),
          hostelStatus: validatedData.hostel,
          transportStatus: validatedData.transport,
          enrollmentDate: validatedData.dateOfJoin,
          status: 'Active'
        }
      });

      // 4. Create StudentFee record with default values
      const studentFee = await prisma.studentFee.create({
        data: {
          enrollmentId: enrollment.id,
          totalFee: 0,  // Default to 0 as requested
          concession: 0,
          individualFee: 0,
          finalFee: 0,
          paidAmount: 0,
          balanceAmount: 0
        }
      });

      // 5. Create Transport Assignment if transport is "Using"
      if (validatedData.transport === "Using") {
        try {
          console.log('Starting transport assignment creation...', {
            transport: validatedData.transport,
            routeName: validatedData.routeName,
            stopName: validatedData.stopName
          });

          if (!validatedData.routeName || !validatedData.stopName) {
            throw new Error('Route and Stop IDs are required for transport assignment');
          }

          const routeId = parseInt(validatedData.routeName);
          const stopId = parseInt(validatedData.stopName);
          const academicYearId = parseInt(validatedData.academicYear);

          console.log('Parsed IDs:', { routeId, stopId, academicYearId });

          // Verify route exists
          const route = await prisma.route.findUnique({
            where: { id: routeId }
          });

          if (!route) {
            throw new Error(`Route with ID ${routeId} not found`);
          }

          // Verify stop exists
          const stop = await prisma.stop.findUnique({
            where: { id: stopId }
          });

          if (!stop) {
            throw new Error(`Stop with ID ${stopId} not found`);
          }

          // Get transport fee if it exists
          const transportFee = await prisma.transportFee.findFirst({
            where: {
              routeId: routeId,
              stopId: stopId,
              academicYearId: academicYearId,
              term: 1
            }
          });

          // Create transport assignment data
          const transportAssignmentData = {
            enrollmentId: enrollment.id,
            routeId: routeId,
            stopId: stopId,
            academicYearId: academicYearId,
            startDate: new Date(),
            term: 1,
            status: 'Using' as const
          };

          // Add feeId only if transport fee exists
          if (transportFee) {
            await prisma.transportAssignment.create({
              data: {
                ...transportAssignmentData,
                feeId: transportFee.id
              }
            });
          } else {
            // Create without feeId
            await prisma.transportAssignment.create({
              data: transportAssignmentData
            });
          }

          console.log('Transport assignment created successfully');

        } catch (err) {
          const error = err as Error;
          console.error('Transport Assignment Error:', error);
          console.error('Failed to create transport assignment:', error.message);
        }
      }

      // 6. Handle Hostel Assignment if hostel is "Using"
      if (validatedData.hostel === "Using" && validatedData.hostelName && validatedData.floorName) {
        const hostelId = parseInt(validatedData.hostelName);
        const roomId = parseInt(validatedData.floorName);
        const academicYearId = parseInt(validatedData.academicYear);

        // Get hostel fee if it exists
        const hostelFee = await prisma.hostelFee.findFirst({
          where: {
            hostelId: hostelId,
            academicYearId: academicYearId
          }
        });

        // Create hostel assignment data
        const hostelAssignmentData = {
          enrollmentId: enrollment.id,
          hostelId: hostelId,
          roomId: roomId,
          academicYearId: academicYearId,
          startDate: validatedData.dateOfJoin,
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          term: 1,
          status: 'Using' as const
        };

        // Add feeId only if hostel fee exists
        if (hostelFee) {
          await prisma.hostelAssignment.create({
            data: {
              ...hostelAssignmentData,
              feeId: hostelFee.id
            }
          });
        } else {
          // Create without feeId
          await prisma.hostelAssignment.create({
            data: hostelAssignmentData
          });
        }
      }

      // 7. Create StudentAuth record
      const hashedPassword = await bcrypt.hash(validatedData.phoneNo, 10);
      await prisma.studentAuth.create({
        data: {
          studentId: student.id,
          username: validatedData.email || validatedData.phoneNo,
          password: hashedPassword
        }
      });

      return {
        student,
        enrollment,
        studentFee,
        person
      };
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        studentId: result.student.id,
        enrollmentId: result.enrollment.id,
        fees: {
          totalFee: result.studentFee.totalFee,
          individualFee: result.studentFee.individualFee,
          finalFee: result.studentFee.finalFee,
          balanceAmount: result.studentFee.balanceAmount
        }
      }
    });

  } catch (error) {
    console.error('Student Registration Error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation Failed',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to register student',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}