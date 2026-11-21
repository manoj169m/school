import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

interface ApiResponse {
  studentDetails: {
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
  };
  academicYearId: number;
  branchId: number;
  classId: number;
  sectionId: number;
  studentFeeId: number;
  studentId: number;
  enrollmentId: number;
  regularFees: Array<{
    accountId: number;
    amount: number;
    dueDate: string;
    term: number | string;
    account: {
      accountName: string;
    };
  }>;
  transportFee: {
    accountId: number;
    amount: number;
    dueDate: string;
    term: number | string;
    account: {
      accountName: string;
    };
  } | null;
  hostelFee: {
    accountId: number;
    amount: number;
    dueDate: string;
    term: number | string;
    account: {
      accountName: string;
    };
  } | null;
  individualFees: Array<{
    accountId: number;
    amount: number;
    term: number | string;
    account: {
      accountName: string;
    };
  }>;
  concessions: Array<{
    accountId: number;
    amount: number;
    term: number | string;
    account: {
      accountName: string;
    };
  }>;
  payments: Array<{
    accountId: number;
    amount: number;
    term: number | string;
    account: {
      accountName: string;
    };
    paymentDetails: Array<{
      amount: number;
      collectedDate: string;
      receiptNumber: string;
    }>;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { error: string; details?: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const enrollmentId = parseInt(req.query.id as string);

    if (!enrollmentId || isNaN(enrollmentId)) {
      return res.status(400).json({ error: "Invalid enrollment ID" });
    }

    // First, fetch the enrollment data
    const enrollment = await prisma.studentEnrollment.findUnique({
      where: { id: enrollmentId },
      select: {
        id: true,
        studentId: true,
        academicYearId: true,
        classId: true,
        sectionId: true,
        branchId: true,
        fee: {
          select: {
            id: true
          }
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
          }
        },
        class: {
          select: { name: true }
        },
        section: {
          select: { name: true }
        },
        branch: {
          select: { name: true }
        },
        academicYear: {
          select: {label: true}
        }
      },
    });

    if (!enrollment) {
      return res.status(404).json({ error: "Student enrollment not found" });
    }

    // Fetch transport assignment and related fees
    const transportAssignment = await prisma.transportAssignment.findFirst({
      where: {
        enrollmentId,
        status: 'Using',
      },
      include: {
        transportFee: {
          include: {
            account: {
              select: {
                id: true,
                accountName: true,
              },
            },
          },
        },
        route: true,
        stop: true,
      },
    });

    // Handle transport fee lookup
    let transportFee = null;
    if (transportAssignment) {
      if (transportAssignment.transportFee) {
        transportFee = transportAssignment.transportFee;
      } else {
        // If no direct fee association, look up the appropriate fee
        transportFee = await prisma.transportFee.findFirst({
          where: {
            routeId: transportAssignment.routeId,
            stopId: transportAssignment.stopId,
            term: transportAssignment.term,
            academicYearId: transportAssignment.academicYearId,
          },
          include: {
            account: {
              select: {
                id: true,
                accountName: true,
              },
            },
          },
        });
      }
    }

    // Fetch hostel assignment and related fees
    const hostelAssignment = await prisma.hostelAssignment.findFirst({
      where: {
        enrollmentId,
        status: 'Using',
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
    });

    // Handle hostel fee lookup
    let hostelFee = null;
    if (hostelAssignment) {
      if (hostelAssignment.hostelFee) {
        hostelFee = hostelAssignment.hostelFee;
      } else {
        // If no direct fee association, look up the appropriate fee
        hostelFee = await prisma.hostelFee.findFirst({
          where: {
            hostelId: hostelAssignment.hostelId,
            term: hostelAssignment.term,
            academicYearId: hostelAssignment.academicYearId,
          },
          include: {
            account: {
              select: {
                id: true,
                accountName: true,
              },
            },
          },
        });
      }
    }

    // Fetch other required data in parallel
    const [regularFees, individualFees, concessions, existingPayments] = await Promise.all([
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
          collectedDate: 'desc',
        },
      })
    ]);

    // Process payments
    const paymentMap = new Map();
    existingPayments.forEach(payment => {
      const key = `${payment.accountId}-${payment.term}`;
      if (!paymentMap.has(key)) {
        paymentMap.set(key, {
          accountId: payment.accountId,
          amount: 0,
          term: payment.term,
          account: {
            accountName: payment.account.accountName,
          },
          paymentDetails: []
        });
      }
      const entry = paymentMap.get(key);
      entry.amount += Number(payment.amount);
      entry.paymentDetails.push({
        amount: Number(payment.amount),
        collectedDate: payment.collectedDate.toISOString(),
        receiptNumber: payment.receiptNumber
      });
    });

    // Prepare response data
    const responseData: ApiResponse = {
      studentDetails: {
        name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
        fatherName: enrollment.student.relationName1 || '',
        branch: enrollment.branch.name,
        contactNo: enrollment.student.communicationNo?.toString() || '',
        phoneNo: enrollment.student.phoneNo?.toString() || '',
        class: enrollment.class.name,
        section: enrollment.section.name,
        academicYear: enrollment.academicYear.label,
        admissionNo: enrollment.student.admissionNo || '',
        rollNo: enrollment.student.rollNo || '',
      },
      academicYearId: enrollment.academicYearId,
      branchId: enrollment.branchId,
      classId: enrollment.classId,
      sectionId: enrollment.sectionId,
      studentFeeId: enrollment.fee?.id || -1,
      studentId: enrollment.studentId,
      enrollmentId: enrollment.id,
      regularFees: regularFees.map(fee => ({
        accountId: fee.accountId,
        amount: Number(fee.amount),
        dueDate: fee.dueDate.toISOString(),
        term: fee.term,
        account: {
          accountName: fee.account.accountName,
        },
      })),
      transportFee: transportFee ? {
        accountId: transportFee.accountId,
        amount: Number(transportFee.feeAmount),
        dueDate: transportAssignment ? new Date(transportAssignment.startDate).toISOString() : new Date().toISOString(),
        term: transportAssignment?.term || 1,
        account: {
          accountName: transportFee.account.accountName,
        },
      } : null,
      hostelFee: hostelFee ? {
        accountId: hostelFee.accountId,
        amount: Number(hostelFee.feeAmount),
        dueDate: hostelAssignment ? new Date(hostelAssignment.startDate).toISOString() : new Date().toISOString(),
        term: hostelAssignment?.term || 1,
        account: {
          accountName: hostelFee.account.accountName,
        },
      } : null,
      individualFees: individualFees.map(fee => ({
        accountId: fee.accountId,
        amount: Number(fee.customAmount),
        term: fee.term,
        account: {
          accountName: fee.account.accountName,
        },
      })),
      concessions: concessions.map(concession => ({
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
    console.error('Error fetching student fees:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch student fees',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}