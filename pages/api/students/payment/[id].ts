import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

interface PaymentDetail {
  amount: number;
  collectedDate: string;
  receiptNumber: string;
}

interface Payment {
  accountId: number;
  amount: number;
  term: number | string;
  account: {
    accountName: string;
  };
  paymentDetails: PaymentDetail[];
}

interface Fee {
  accountId: number;
  amount: number;
  dueDate: string;
  term: number | string;
  account: {
    accountName: string;
  };
}

interface StudentDetails {
  name: string;
  fatherName: string;
  branch: string;
  contactNo: string;
  class: string;
  section: string;
  academicYear: string;
  phoneNo: string;
  admissionNo: string;
  rollNo: string;
}

interface PaymentResponse {
  studentDetails: StudentDetails;
  academicYearId: number;
  branchId: number;
  classId: number;
  sectionId: number;
  studentFeeId: number;
  studentId: number;
  enrollmentId: number;
  regularFees: Fee[];
  transportFee: Fee | null;
  hostelFee: Fee | null;
  individualFees: Fee[];
  concessions: Array<{
    accountId: number;
    amount: number;
    term: number | string;
    account: {
      accountName: string;
    };
  }>;
  payments: Payment[];
}

export const config = {
  maxDuration: 60,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PaymentResponse | { error: string; details?: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const studentId = parseInt(req.query.id as string);

    if (!studentId || isNaN(studentId)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    // Get current academic year and enrollment data
    const [currentAcademicYear, enrollment] = await Promise.all([
      prisma.academicYear.findFirst({
        where: { isCurrentYear: true },
      }),
      prisma.studentEnrollment.findFirst({
        where: {
          studentId,
          academicYear: { isCurrentYear: true },
        },
        select: {
          id: true,
          studentId: true,
          academicYearId: true,
          classId: true,
          sectionId: true,
          branchId: true,
          hostelStatus: true,
          fee: {
            select: {
              id: true,
            },
          },
          student: {
            select: {
              firstName: true,
              lastName: true,
              communicationNo: true,
              phoneNo: true,
              relationName1: true,
              admissionNo: true,
              rollNo: true,
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
          academicYear: {
            select: { label: true },
          },
        },
      }),
    ]);

    if (!currentAcademicYear || !enrollment) {
      return res.status(404).json({ error: "Student enrollment not found" });
    }

    // Fetch all required data in parallel
    const [
      regularFees,
      individualFees,
      concessions,
      payments,
      transportAssignment,
      hostelAssignment,
    ] = await Promise.all([
      // Regular fees
      prisma.feeByClass.findMany({
        where: {
          academicYearId: enrollment.academicYearId,
          classId: enrollment.classId,
          sectionId: enrollment.sectionId,
          branchId: enrollment.branchId,
        },
        include: {
          account: {
            select: {
              accountName: true,
            },
          },
        },
      }),
      // Individual fees
      prisma.individualFee.findMany({
        where: {
          studentFeeId: enrollment.fee?.id || -1,
          academicYearId: enrollment.academicYearId,
          classId: enrollment.classId,
          sectionId: enrollment.sectionId,
          branchId: enrollment.branchId,
        },
        include: {
          account: {
            select: {
              accountName: true,
            },
          },
        },
      }),
      // Concessions
      prisma.concession.findMany({
        where: {
          studentFeeId: enrollment.fee?.id || -1,
          academicYearId: enrollment.academicYearId,
          classId: enrollment.classId,
          sectionId: enrollment.sectionId,
          branchId: enrollment.branchId,
        },
        include: {
          account: {
            select: {
              accountName: true,
            },
          },
        },
      }),
      // Payments
      prisma.payment.findMany({
        where: {
          studentFeeId: enrollment.fee?.id || -1,
          studentId: enrollment.studentId,
          academicYearId: enrollment.academicYearId,
        },
        include: {
          account: {
            select: {
              accountName: true,
            },
          },
        },
        orderBy: {
          collectedDate: "desc",
        },
      }),
      // Transport Assignment
      prisma.transportAssignment.findFirst({
        where: {
          enrollmentId: enrollment.id,
          status: "Using",
        },
        include: {
          transportFee: true,
          route: true,
          stop: true,
        },
      }),
      // Hostel Assignment
      prisma.hostelAssignment.findFirst({
        where: {
          enrollmentId: enrollment.id,
          status: "Using",
          startDate: {
            lte: new Date(),
          },
          endDate: {
            gte: new Date(),
          },
        },
        include: {
          hostelFee: {
            include: {
              account: {
                select: {
                  id: true,
                  accountName: true,
                },
              },
            },
          },
          hostel: true,
        },
        orderBy: {
          startDate: "desc",
        },
      }),
    ]);

    // Process transport fee
    let transportFee = null;
    if (transportAssignment) {
      const fee =
        transportAssignment.transportFee ||
        (await prisma.transportFee.findFirst({
          where: {
            routeId: transportAssignment.routeId,
            stopId: transportAssignment.stopId,
            academicYearId: enrollment.academicYearId,
            term: transportAssignment.term || 1,
          },
          include: {
            account: {
              select: {
                id: true,
                accountName: true,
              },
            },
          },
        }));

      if (fee) {
        transportFee = {
          accountId: fee.accountId,
          amount: Number(fee.feeAmount),
          dueDate:
            transportAssignment.startDate?.toISOString() ||
            new Date().toISOString(),
          term: transportAssignment.term || 1,
          account: {
            accountName: "Transport Fee",
          },
        };
      }
    }

    // Process hostel fee
    let hostelFee = null;
     if (hostelAssignment) {
       const fee =
         hostelAssignment.hostelFee ||
         (await prisma.hostelFee.findFirst({
           where: {
             hostelId: hostelAssignment.hostelId,
             academicYearId: enrollment.academicYearId,
             term: hostelAssignment.term,
           },
           include: {
             account: {
               select: {
                 id: true,
                 accountName: true,
               },
             },
           },
         }));

       if (fee) {
         hostelFee = {
           accountId: fee.accountId,
           amount: Number(fee.feeAmount),
           dueDate: hostelAssignment.startDate.toISOString(),
           term: hostelAssignment.term,
           account: {
             accountName: fee.account.accountName,
           },
         };
       }
     }
       
    // Process payments
    const paymentMap = new Map();
    payments.forEach((payment) => {
      const key = `${payment.accountId}-${payment.term}`;
      if (!paymentMap.has(key)) {
        paymentMap.set(key, {
          accountId: payment.accountId,
          amount: 0,
          term: payment.term,
          account: {
            accountName: payment.account.accountName,
          },
          paymentDetails: [],
        });
      }
      const entry = paymentMap.get(key);
      entry.amount += Number(payment.amount);
      entry.paymentDetails.push({
        amount: Number(payment.amount),
        collectedDate: payment.collectedDate.toISOString(),
        receiptNumber: payment.receiptNumber,
      });
    });

    const responseData: PaymentResponse = {
      studentDetails: {
        name: `${enrollment.student.firstName} ${
          enrollment.student.lastName || ""
        }`.trim(),
        fatherName: enrollment.student.relationName1 || "",
        branch: enrollment.branch.name,
        contactNo: enrollment.student.communicationNo?.toString() || "",
        phoneNo: enrollment.student.phoneNo?.toString() || "",
        class: enrollment.class.name,
        section: enrollment.section.name,
        academicYear: enrollment.academicYear.label,
        admissionNo: enrollment.student.admissionNo || "",
        rollNo: enrollment.student.rollNo || "",
      },
      academicYearId: enrollment.academicYearId,
      branchId: enrollment.branchId,
      classId: enrollment.classId,
      sectionId: enrollment.sectionId,
      studentFeeId: enrollment.fee?.id || -1,
      studentId: enrollment.studentId,
      enrollmentId: enrollment.id,
      regularFees: regularFees.map((fee) => ({
        accountId: fee.accountId,
        amount: Number(fee.amount),
        dueDate: fee.dueDate.toISOString(),
        term: fee.term,
        account: {
          accountName: fee.account.accountName,
        },
      })),
      transportFee,
      hostelFee,
      individualFees: individualFees.map((fee) => ({
        accountId: fee.accountId,
        amount: Number(fee.customAmount),
        term: fee.term,
        dueDate: new Date().toISOString(),
        account: {
          accountName: fee.account.accountName,
        },
      })),
      concessions: concessions.map((concession) => ({
        accountId: concession.accountId,
        amount: Number(concession.amount),
        term: concession.term,
        account: {
          accountName: concession.account.accountName,
        },
      })),
      payments: Array.from(paymentMap.values()),
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching student fees:", error);
    return res.status(500).json({
      error: "Failed to fetch student fees",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
