// pages/api/students/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Zod Schema for Student Update
const studentUpdateSchema = z.object({
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
  routeName: z.string().optional(),
  stopName: z.string().optional(),
  hostelName: z.string().optional(),
  floorName: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const studentId = parseInt(req.query.id as string);
    if (!studentId || isNaN(studentId)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const validatedData = studentUpdateSchema.parse(req.body);

    const result = await prisma.$transaction(async (prisma) => {
      // 1. Update Person record
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { person: true },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      await prisma.person.update({
        where: { id: student.personId },
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email || "",
        },
      });

      // 2. Update Student record
      const updatedStudent = await prisma.student.update({
        where: { id: studentId },
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          gender: validatedData.gender,
          dateOfBirth: validatedData.dateOfBirth,
          placeOfBirth: validatedData.placeOfBirth || "",
          country: validatedData.country,
          state: validatedData.state,
          cityTownVillage: validatedData.cityTownVillage,
          address: validatedData.address,
          communicationNo: BigInt(
            validatedData.communicationNo.replace(/\+|\s/g, "")
          ),
          phoneNo: BigInt(validatedData.phoneNo.replace(/\+|\s/g, "")),
          email: validatedData.email,
          aadharNo: validatedData.aadharNo
            ? BigInt(validatedData.aadharNo)
            : null,
          emisNo: validatedData.emisNo,
          community: validatedData.community,
          caste: validatedData.caste,
          bloodGroup: validatedData.bloodGroup,
          motherTongue: validatedData.motherTongue,
          religion: validatedData.religion,
          relationName1: validatedData.relationName1,
          relationType1: validatedData.relationType1,
          relationNo1: BigInt(validatedData.relationNo1.replace(/\+|\s/g, "")),
          relationName2: validatedData.relationName2,
          relationType2: validatedData.relationType2,
          relationNo2: validatedData.relationNo2
            ? BigInt(validatedData.relationNo2.replace(/\+|\s/g, ""))
            : null,
          admissionNo: validatedData.admissionNo,
          applicationNo: validatedData.applicationNo,
          rollNo: validatedData.rollNo,
        },
      });

      // 3. Update StudentEnrollment record
      const currentEnrollment = await prisma.studentEnrollment.findFirst({
        where: {
          studentId: studentId,
          status: "Active",
        },
      });

      if (!currentEnrollment) {
        throw new Error("No active enrollment found");
      }

      const updatedEnrollment = await prisma.studentEnrollment.update({
        where: { id: currentEnrollment.id },
        data: {
          academicYearId: parseInt(validatedData.academicYear),
          classId: parseInt(validatedData.class),
          sectionId: parseInt(validatedData.section),
          feeCategoryId: parseInt(validatedData.feeCategory),
          branchId: parseInt(validatedData.branch),
          hostelStatus: validatedData.hostel,
          transportStatus: validatedData.transport,
          enrollmentDate: validatedData.dateOfJoin,
        },
      });

      // 4. Handle Transport Assignment Update
      if (
        validatedData.transport === "Using" &&
        validatedData.routeName &&
        validatedData.stopName
      ) {
        // Deactivate existing transport assignments
        await prisma.transportAssignment.updateMany({
          where: {
            enrollmentId: currentEnrollment.id,
            status: "Using",
          },
          data: {
            status: "NotUsing",
            endDate: new Date(),
          },
        });

        // Create new transport assignment
        const transportAssignmentData = {
          enrollmentId: currentEnrollment.id,
          routeId: parseInt(validatedData.routeName),
          stopId: parseInt(validatedData.stopName),
          academicYearId: parseInt(validatedData.academicYear),
          startDate: new Date(),
          term: 1,
          status: "Using" as const,
        };

        const transportFee = await prisma.transportFee.findFirst({
          where: {
            routeId: parseInt(validatedData.routeName),
            stopId: parseInt(validatedData.stopName),
            academicYearId: parseInt(validatedData.academicYear),
            term: 1,
          },
        });

        if (transportFee) {
          await prisma.transportAssignment.create({
            data: {
              ...transportAssignmentData,
              feeId: transportFee.id,
            },
          });
        } else {
          await prisma.transportAssignment.create({
            data: transportAssignmentData,
          });
        }
      } else if (validatedData.transport === "NotUsing") {
        // Deactivate all transport assignments
        await prisma.transportAssignment.updateMany({
          where: {
            enrollmentId: currentEnrollment.id,
            status: "Using",
          },
          data: {
            status: "NotUsing",
            endDate: new Date(),
          },
        });
      }

      // 5. Handle Hostel Assignment Update
      if (
        validatedData.hostel === "Using" &&
        validatedData.hostelName &&
        validatedData.floorName
      ) {
        // Deactivate existing hostel assignments
        await prisma.hostelAssignment.updateMany({
          where: {
            enrollmentId: currentEnrollment.id,
            status: "Using",
          },
          data: {
            status: "NotUsing",
            endDate: new Date(),
          },
        });

        // Create new hostel assignment
        const hostelAssignmentData = {
          enrollmentId: currentEnrollment.id,
          hostelId: parseInt(validatedData.hostelName),
          roomId: parseInt(validatedData.floorName),
          academicYearId: parseInt(validatedData.academicYear),
          startDate: validatedData.dateOfJoin,
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          term: 1,
          status: "Using" as const,
        };

        const hostelFee = await prisma.hostelFee.findFirst({
          where: {
            hostelId: parseInt(validatedData.hostelName),
            academicYearId: parseInt(validatedData.academicYear),
          },
        });

        if (hostelFee) {
          await prisma.hostelAssignment.create({
            data: {
              ...hostelAssignmentData,
              feeId: hostelFee.id,
            },
          });
        } else {
          await prisma.hostelAssignment.create({
            data: hostelAssignmentData,
          });
        }
      } else if (validatedData.hostel === "NotUsing") {
        // Deactivate all hostel assignments
        await prisma.hostelAssignment.updateMany({
          where: {
            enrollmentId: currentEnrollment.id,
            status: "Using",
          },
          data: {
            status: "NotUsing",
            endDate: new Date(),
          },
        });
      }

      // Get updated student fee details
      const studentFee = await prisma.studentFee.findFirst({
        where: { enrollmentId: currentEnrollment.id },
      });

      return {
        student: updatedStudent,
        enrollment: updatedEnrollment,
        studentFee,
      };
    });

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: {
        studentId: result.student.id,
        enrollmentId: result.enrollment.id,
        fees: {
          totalFee: result.studentFee?.totalFee || 0,
          individualFee: result.studentFee?.individualFee || 0,
          finalFee: result.studentFee?.finalFee || 0,
          balanceAmount: result.studentFee?.balanceAmount || 0,
        },
      },
    });
  } catch (error) {
    console.error("Student Update Error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation Failed",
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to update student",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
