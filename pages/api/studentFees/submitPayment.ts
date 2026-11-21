// pages/api/studentFees/submitPayment.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { ReceiptService } from '@/lib/receipt/receiptService';

interface PaymentSubmission {
  studentFeeId: number;
  studentId: number;
  enrollmentId: number;
  branchId: number;
  academicYearId: number;
  payments: Array<{
    accountId: number;
    term: number;
    amount: number;
  }>;
  paymentDetails: {
    paymentMode: string;
    collectedDate: string;
    bankName?: string;
    reference?: string;
    description?: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body as PaymentSubmission;

    if (!payload?.payments?.length) {
      return res.status(400).json({ error: 'Invalid payment data' });
    }

    const [receiptConfig, enrollment] = await Promise.all([
      prisma.receiptConfig.findFirst({
        where: {
          isActive: true,
          OR: [{ accountId: null }, { accountId: payload.payments[0].accountId }]
        },
        orderBy: { accountId: 'desc' }
      }),
      prisma.studentEnrollment.findUnique({
        where: { id: payload.enrollmentId },
        include: {
          student: { select: { firstName: true, lastName: true } },
          class: { select: { name: true } },
          section: { select: { name: true } }
        }
      })
    ]);

    if (!receiptConfig || !enrollment) {
      return res.status(404).json({ 
        error: !receiptConfig ? 'Receipt configuration not found' : 'Enrollment not found' 
      });
    }

    const receiptService = new ReceiptService(prisma);

    const result = await prisma.$transaction(async (tx) => {
      // All receipt generation in a single transaction
      const { receiptNumber: baseNumber, receiptSeriesId } = 
        await receiptService.generateReceiptNumber(
          payload.payments[0].accountId,
          enrollment.academicYearId,
          payload.branchId
        );

      // Create all payments sequentially with proper receipt numbers
      const payments = [];
      for (let i = 0; i < payload.payments.length; i++) {
        const payment = payload.payments[i];
        const receiptNumber = i === 0 ? baseNumber : `${baseNumber}-${i + 1}`;
        
        const paymentRecord = await tx.payment.create({
          data: {
            studentFeeId: payload.studentFeeId,
            studentId: payload.studentId,
            enrollmentId: payload.enrollmentId,
            accountId: payment.accountId,
            academicYearId: enrollment.academicYearId,
            branchId: payload.branchId,
            term: payment.term,
            amount: payment.amount,
            paymentMode: payload.paymentDetails.paymentMode,
            bankName: payload.paymentDetails.bankName || null,
            reference: payload.paymentDetails.reference || null,
            collectedDate: new Date(payload.paymentDetails.collectedDate),
            collectedBy: 'SYSTEM',
            description: payload.paymentDetails.description || `Payment for term ${payment.term}`,
            receiptNumber,
            receiptSeriesId
          }
        });
        payments.push(paymentRecord);
      }

      const totalPaidAmount = payload.payments.reduce((sum, p) => sum + p.amount, 0);

      // Update fee and create changelog
      const [updatedFee] = await Promise.all([
        tx.studentFee.update({
          where: { id: payload.studentFeeId },
          data: {
            paidAmount: { increment: totalPaidAmount },
            balanceAmount: { decrement: totalPaidAmount }
          }
        }),
        tx.changeLog.create({
          data: {
            tableName: 'payments',
            recordId: payments[0].id,
            operation: 'CREATE',
            changes: {
              totalAmount: totalPaidAmount,
              baseReceiptNumber: baseNumber,
              paymentMode: payload.paymentDetails.paymentMode,
              studentName: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
              class: enrollment.class.name,
              section: enrollment.section.name,
              paymentCount: payments.length
            },
            performedBy: 0,
            timestamp: new Date()
          }
        })
      ]);

      return { payments, totalPaid: totalPaidAmount, updatedFee };
    });

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Payment processed successfully'
    });

  } catch (error) {
    console.error('Payment submission error:', error);
    return res.status(500).json({
      error: 'Failed to submit payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}