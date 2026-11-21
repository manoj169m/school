import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

interface StudentFeeDetail {
  id: string;
  name: string;
  rollNumber: string;
  gender: string;
  admissionNo: string;
  branch: string;
  village: string;
  mobileNo: string;
  class: string;
  section: string;
  accountWiseDetails: Array<{
    accountId: number;
    accountName: string;
    targetFee: number;
    concession: number;
    paid: number;
    pending: number;
  }>;
  totalTargetFee: number;
  totalConcession: number;
  totalPaid: number;
  totalPending: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StudentFeeDetail[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Request-Timeout', '300000'); // 5 minutes
  
  try {
    const {
      academicYearId,
      branchIds,
      classIds,
      sectionIds,
      accountIds,
      termIds,
      paymentStatus,
      transportUsing,
      hostelUsing
    } = req.query;

    // Parse query parameters efficiently
    const parsedParams = {
      academicYearId: parseInt(academicYearId as string),
      branchIds: (branchIds ? (Array.isArray(branchIds) ? branchIds : [branchIds]) : []).map(Number),
      classIds: (classIds ? (Array.isArray(classIds) ? classIds : [classIds]) : []).map(Number),
      sectionIds: (sectionIds ? (Array.isArray(sectionIds) ? sectionIds : [sectionIds]) : []).map(Number),
      accountIds: (accountIds ? (Array.isArray(accountIds) ? accountIds : [accountIds]) : []).map(Number),
      termIds: (termIds ? (Array.isArray(termIds) ? termIds : [termIds]) : []).map(Number)
    };

    // Fetch all required data in parallel for better performance
    const [enrollments, regularFees, transportFees, hostelFees] = await Promise.all([
      // Base enrollment query with essential includes
      prisma.studentEnrollment.findMany({
        where: {
          academicYearId: parsedParams.academicYearId,
          branchId: { in: parsedParams.branchIds },
          classId: { in: parsedParams.classIds },
          sectionId: { in: parsedParams.sectionIds },
          status: paymentStatus === 'Active' ? 'Active' : 'Inactive',
        },
        include: {
          student: true,
          branch: true,
          class: true,
          section: true,
          fee: {
            include: {
              payment: {
                where: {
                  AND: [
                    { accountId: { in: parsedParams.accountIds } },
                    { term: { in: parsedParams.termIds } }
                  ]
                },
                include: {
                  account: true
                }
              },
              concessions: {
                where: {
                  AND: [
                    { accountId: { in: parsedParams.accountIds } },
                    { term: { in: parsedParams.termIds } }
                  ]
                },
                include: {
                  account: true
                }
              },
              individualFees: {
                where: {
                  AND: [
                    { accountId: { in: parsedParams.accountIds } },
                    { term: { in: parsedParams.termIds } }
                  ]
                },
                include: {
                  account: true
                }
              }
            }
          },
          transportAssignments: transportUsing === 'true' ? {
            where: {
              status: 'Using',
              term: { in: parsedParams.termIds }
            },
            include: {
              route: true,
              stop: true
            }
          } : undefined,
          hostelAssignments: hostelUsing === 'true' ? {
            where: {
              status: 'Using',
              term: { in: parsedParams.termIds }
            },
            include: {
              hostel: true,
              room: true
            }
          } : undefined
        }
      }),
      // Regular fees
      prisma.feeByClass.findMany({
        where: {
          academicYearId: parsedParams.academicYearId,
          branchId: { in: parsedParams.branchIds },
          classId: { in: parsedParams.classIds },
          sectionId: { in: parsedParams.sectionIds },
          accountId: { in: parsedParams.accountIds },
          term: { in: parsedParams.termIds }
        },
        include: {
          account: true
        }
      }),
      // Transport fees
      transportUsing === 'true' ? prisma.transportFee.findMany({
        where: {
          academicYearId: parsedParams.academicYearId,
          accountId: { in: parsedParams.accountIds },
          term: { in: parsedParams.termIds }
        },
        include: {
          account: true
        }
      }) : Promise.resolve([]),
      // Hostel fees
      hostelUsing === 'true' ? prisma.hostelFee.findMany({
        where: {
          academicYearId: parsedParams.academicYearId,
          accountId: { in: parsedParams.accountIds },
          term: { in: parsedParams.termIds }
        },
        include: {
          account: true
        }
      }) : Promise.resolve([])
    ]);

    // Process the data
    const studentFeeDetails: StudentFeeDetail[] = enrollments.map(enrollment => {
      const accountDetailsMap = new Map();

      // Initialize account details with regular fees
      regularFees
        .filter(fee => 
          fee.branchId === enrollment.branchId && 
          fee.classId === enrollment.classId && 
          fee.sectionId === enrollment.sectionId
        )
        .forEach(fee => {
          if (!accountDetailsMap.has(fee.accountId)) {
            accountDetailsMap.set(fee.accountId, {
              accountId: fee.accountId,
              accountName: fee.account.accountName,
              targetFee: Number(fee.amount),
              concession: 0,
              paid: 0,
              pending: 0
            });
          } else {
            accountDetailsMap.get(fee.accountId).targetFee += Number(fee.amount);
          }
        });

      // Add individual fees
      enrollment.fee?.individualFees.forEach(indFee => {
        const accountId = indFee.accountId;
        if (!accountDetailsMap.has(accountId)) {
          accountDetailsMap.set(accountId, {
            accountId,
            accountName: indFee.account.accountName,
            targetFee: Number(indFee.customAmount),
            concession: 0,
            paid: 0,
            pending: 0
          });
        } else {
          accountDetailsMap.get(accountId).targetFee += Number(indFee.customAmount);
        }
      });

      // Add transport fees if applicable
      if (enrollment.transportAssignments?.length) {
        const transportFeesMap = new Map(
          transportFees.map(fee => [`${fee.routeId}-${fee.stopId}-${fee.term}`, fee])
        );

        enrollment.transportAssignments.forEach(assignment => {
          const transportFee = transportFeesMap.get(`${assignment.routeId}-${assignment.stopId}-${assignment.term}`);
          if (transportFee) {
            const accountId = transportFee.accountId;
            if (!accountDetailsMap.has(accountId)) {
              accountDetailsMap.set(accountId, {
                accountId,
                accountName: transportFee.account.accountName,
                targetFee: Number(transportFee.feeAmount),
                concession: 0,
                paid: 0,
                pending: 0
              });
            } else {
              accountDetailsMap.get(accountId).targetFee += Number(transportFee.feeAmount);
            }
          }
        });
      }

      // Add hostel fees if applicable
      if (enrollment.hostelAssignments?.length) {
        const hostelFeesMap = new Map(
          hostelFees.map(fee => [`${fee.hostelId}-${fee.term}`, fee])
        );

        enrollment.hostelAssignments.forEach(assignment => {
          const hostelFee = hostelFeesMap.get(`${assignment.hostelId}-${assignment.term}`);
          if (hostelFee) {
            const accountId = hostelFee.accountId;
            if (!accountDetailsMap.has(accountId)) {
              accountDetailsMap.set(accountId, {
                accountId,
                accountName: hostelFee.account.accountName,
                targetFee: Number(hostelFee.feeAmount),
                concession: 0,
                paid: 0,
                pending: 0
              });
            } else {
              accountDetailsMap.get(accountId).targetFee += Number(hostelFee.feeAmount);
            }
          }
        });
      }

      // Process concessions
      enrollment.fee?.concessions.forEach(concession => {
        const accountId = concession.accountId;
        if (accountDetailsMap.has(accountId)) {
          accountDetailsMap.get(accountId).concession += Number(concession.amount);
        }
      });

      // Process payments
      enrollment.fee?.payment.forEach(payment => {
        const accountId = payment.accountId;
        if (accountDetailsMap.has(accountId)) {
          accountDetailsMap.get(accountId).paid += Number(payment.amount);
        }
      });

      // Calculate totals and pending amounts
      let totalTargetFee = 0;
      let totalConcession = 0;
      let totalPaid = 0;
      let totalPending = 0;

      const accountWiseDetails = Array.from(accountDetailsMap.values()).map(detail => {
        detail.pending = detail.targetFee - detail.concession - detail.paid;
        
        totalTargetFee += detail.targetFee;
        totalConcession += detail.concession;
        totalPaid += detail.paid;
        totalPending += detail.pending;
        
        return detail;
      });

      return {
        id: enrollment.id.toString(),
        name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
        rollNumber: enrollment.student.rollNo || '',
        gender: enrollment.student.gender,
        admissionNo: enrollment.student.admissionNo || '',
        branch: enrollment.branch.name,
        village: enrollment.student.cityTownVillage || '',
        mobileNo: enrollment.student.communicationNo?.toString() || '',
        class: enrollment.class.name,
        section: enrollment.section.name,
        accountWiseDetails,
        totalTargetFee,
        totalConcession,
        totalPaid,
        totalPending
      };
    });

    return res.status(200).json(studentFeeDetails);

  } catch (error) {
    console.error('Error fetching payment report data:', error);
    return res.status(500).json({ error: 'Failed to fetch payment report data' });
  }
}