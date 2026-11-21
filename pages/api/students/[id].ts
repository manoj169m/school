// api/students/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { StateTypes, BloodGroupTypes, CountryTypes } from "@/constant/data";

interface ApiResponse {
  student: {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    placeOfBirth: string | null;
    country: string | null;
    state: string | null;
    cityTownVillage: string | null;
    address: string | null;
    communicationNo: string | null;
    phoneNo: string | null;
    email: string | null;
    aadharNo: string | null;
    emisNo: string | null;
    community: string | null;
    caste: string | null;
    bloodGroup: string | null;
    motherTongue: string | null;
    religion: string | null;
    relationName1: string | null;
    relationType1: string | null;
    relationNo1: string | null;
    relationName2: string | null;
    relationType2: string | null;
    relationNo2: string | null;
    relationName3: string | null;
    relationType3: string | null;
    relationNo3: string | null;
    admissionNo: string | null;
    applicationNo: string | null;
    rollNo: string | null;
    gender: string;
    personId: number;
    createdAt: string;
    updatedAt: string;
  };
  currentEnrollment: {
    id: number;
    academicYearId: number;
    classId: number;
    sectionId: number;
    branchId: number;
    status: string;
    branchName: string;
    section: string;
    academicYear: string;
    class: string;
    feeCategoryId: number;
    feeCategoryName: string | null;
    hostelStatus: string;
    transportStatus: string;
    enrollmentDate: string;
    classJoin: string | null;
    joinYear: string | null;
  } | null;
  studentFee: {
    totalFee: number;
    concession: number;
    individualFee: number;
    finalFee: number;
    paidAmount: number;
    balanceAmount: number;
  } | null;
  transportDetails: {
    transportAssignment: {
      id: number;
      routeId: number;
      stopId: number;
      academicYearId: number;
      status: string;
      route: {
        id: number;
        routeName: string;
      };
      stop: {
        id: number;
        stopName: string;
        distance: string;
      };
    } | null;
  };
  hostelDetails: {
    hostelAssignment: {
      id: number;
      hostelId: number;
      roomId: number;
      academicYearId: number;
      status: string;
      hostel: {
        id: number;
        hostelName: string;
      };
      room: {
        id: number;
        roomNumber: string;
        floorNumber: string;
      };
    } | null;
  };
  staticData: {
    countries: string[];
    states: string[];
    bloodGroups: string[];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { error: string; details?: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const studentId = parseInt(req.query.id as string);

    if (!studentId || isNaN(studentId)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          where: {
            status: "Active",
          },
          take: 1,
          orderBy: {
            academicYearId: "desc",
          },
          include: {
            academicYear: true,
            class: true,
            section: true,
            branch: true,
            fee: true,
            feeCategory: true,
            transportAssignments: {
              where: {
                status: "Using",
              },
              take: 1,
              orderBy: {
                startDate: "desc",
              },
              include: {
                route: {
                  select: {
                    id: true,
                    routeName: true,
                  },
                },
                stop: {
                  select: {
                    id: true,
                    stopName: true,
                    distance: true,
                  },
                },
              },
            },
            hostelAssignments: {
              where: {
                status: "Using",
              },
              take: 1,
              orderBy: {
                startDate: "desc",
              },
              include: {
                hostel: {
                  select: {
                    id: true,
                    hostelName: true,
                  },
                },
                room: {
                  select: {
                    id: true,
                    roomNumber: true,
                    floorNumber: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const currentEnrollment = student.enrollments[0];
    const transportAssignment =
      currentEnrollment?.transportAssignments[0] || null;
    const hostelAssignment = currentEnrollment?.hostelAssignments[0] || null;

    // Format the response data
    const responseData: ApiResponse = {
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth.toISOString(),
        placeOfBirth: student.placeOfBirth,
        country: student.country,
        state: student.state,
        cityTownVillage: student.cityTownVillage,
        address: student.address,
        communicationNo: student.communicationNo?.toString() || null,
        phoneNo: student.phoneNo?.toString() || null,
        email: student.email,
        aadharNo: student.aadharNo?.toString() || null,
        emisNo: student.emisNo,
        community: student.community,
        caste: student.caste,
        bloodGroup: student.bloodGroup,
        motherTongue: student.motherTongue,
        religion: student.religion,
        relationName1: student.relationName1,
        relationType1: student.relationType1,
        relationNo1: student.relationNo1?.toString() || null,
        relationName2: student.relationName2,
        relationType2: student.relationType2,
        relationNo2: student.relationNo2?.toString() || null,
        relationName3: student.relationName3,
        relationType3: student.relationType3,
        relationNo3: student.relationNo3?.toString() || null,
        admissionNo: student.admissionNo,
        applicationNo: student.applicationNo,
        rollNo: student.rollNo,
        gender: student.gender,
        personId: student.personId,
        createdAt: student.createdAt.toISOString(),
        updatedAt: student.updatedAt.toISOString(),
      },
      currentEnrollment: currentEnrollment
        ? {
            id: currentEnrollment.id,
            academicYearId: currentEnrollment.academicYearId,
            classId: currentEnrollment.classId,
            sectionId: currentEnrollment.sectionId,
            section: currentEnrollment.section?.name ?? "",
            class: currentEnrollment.class?.name ?? "",
            branchName: currentEnrollment.branch?.name ?? "",
            academicYear: currentEnrollment.academicYear?.label ?? "",
            branchId: currentEnrollment.branchId,
            status: currentEnrollment.status,
            feeCategoryId: currentEnrollment.feeCategoryId,
            feeCategoryName: currentEnrollment.feeCategory?.category || null,
            hostelStatus: currentEnrollment.hostelStatus,
            transportStatus: currentEnrollment.transportStatus,
            enrollmentDate: currentEnrollment.enrollmentDate.toISOString(),
            classJoin: currentEnrollment.class?.name || null,
            joinYear: currentEnrollment.academicYear?.label || null,
          }
        : null,
      studentFee: currentEnrollment?.fee
        ? {
            totalFee: currentEnrollment.fee.totalFee,
            concession: currentEnrollment.fee.concession,
            individualFee: currentEnrollment.fee.individualFee,
            finalFee: currentEnrollment.fee.finalFee,
            paidAmount: currentEnrollment.fee.paidAmount,
            balanceAmount: currentEnrollment.fee.balanceAmount,
          }
        : null,
      transportDetails: {
        transportAssignment: transportAssignment
          ? {
              id: transportAssignment.id,
              routeId: transportAssignment.routeId,
              stopId: transportAssignment.stopId,
              academicYearId: transportAssignment.academicYearId,
              status: transportAssignment.status,
              route: {
                id: transportAssignment.route.id,
                routeName: transportAssignment.route.routeName,
              },
              stop: {
                id: transportAssignment.stop.id,
                stopName: transportAssignment.stop.stopName,
                distance: transportAssignment.stop.distance,
              },
            }
          : null,
      },
      hostelDetails: {
        hostelAssignment: hostelAssignment
          ? {
              id: hostelAssignment.id,
              hostelId: hostelAssignment.hostelId,
              roomId: hostelAssignment.roomId,
              academicYearId: hostelAssignment.academicYearId,
              status: hostelAssignment.status,
              hostel: {
                id: hostelAssignment.hostel.id,
                hostelName: hostelAssignment.hostel.hostelName,
              },
              room: {
                id: hostelAssignment.room.id,
                roomNumber: hostelAssignment.room.roomNumber,
                floorNumber: hostelAssignment.room.floorNumber.toString(), // Convert number to string
              },
            }
          : null,
      },
      staticData: {
        countries: CountryTypes,
        states: StateTypes,
        bloodGroups: BloodGroupTypes,
      },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching student details:", error);
    return res.status(500).json({
      error: "Failed to fetch student details",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
