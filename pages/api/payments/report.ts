import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      academicYears,
      accounts,
      branches,
      terms,
      fromDate,
      toDate,
      paymentModes
    } = req.body;

    // Validate required parameters
    if (!academicYears?.length || !accounts?.length || !branches?.length || !terms?.length) {
      return res.status(400).json({
        message: 'Required parameters missing'
      });
    }

    // Convert string arrays to numbers for IDs
    const academicYearIds = academicYears.map(Number);
    const accountIds = accounts.map(Number);
    const branchIds = branches.map(Number);
    const termNumbers = terms.map(Number);

    // Create Date objects and set to start/end of day to ensure full day coverage
    const startDate = startOfDay(new Date(fromDate));
    const endDate = endOfDay(new Date(toDate));

    console.log('Query Parameters:', {
      academicYearIds,
      accountIds,
      branchIds,
      termNumbers,
      paymentModes,
      startDate,
      endDate
    });

    const payments = await prisma.payment.findMany({
      where: {
        AND: [
          {
            academicYearId: {
              in: academicYearIds
            }
          },
          {
            accountId: {
              in: accountIds
            }
          },
          {
            branchId: {
              in: branchIds
            }
          },
          {
            term: {
              in: termNumbers
            }
          },
          {
            paymentMode: {
              in: paymentModes
            }
          },
          {
            collectedDate: {
              gte: startDate,
              lte: endDate
            }
          }
        ]
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        enrollment: {
          select: {
            class: {
              select: {
                name: true
              }
            },
            section: {
              select: {
                name: true
              }
            }
          }
        },
        academicYear: {
          select: {
            label: true
          }
        },
        branch: {
          select: {
            name: true
          }
        },
        account: {
          select: {
            accountName: true
          }
        }
      },
      orderBy: [
        {
          collectedDate: 'desc'
        },
        {
          receiptNumber: 'desc'
        }
      ]
    });

    console.log(`Found ${payments.length} payments`);

    // Transform the response to include formatted data
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      receiptNumber: payment.receiptNumber,
      studentName: `${payment.student.firstName} ${payment.student.lastName}`,
      className: payment.enrollment.class.name,
      sectionName: payment.enrollment.section.name,
      academicYear: payment.academicYear.label,
      branchName: payment.branch.name,
      accountName: payment.account.accountName,
      amount: payment.amount,
      term: payment.term,
      paymentMode: payment.paymentMode,
      collectedDate: payment.collectedDate,
      collectedBy: payment.collectedBy,
      reference: payment.reference,
      bankName: payment.bankName
    }));

    return res.status(200).json(formattedPayments);
  } catch (error) {
    console.error('Payment report error:', error);
    return res.status(500).json({
      message: 'Error generating payment report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}