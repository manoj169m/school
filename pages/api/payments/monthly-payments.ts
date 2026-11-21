// pages/api/payments/monthly-payments.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { BranchWiseStats, DailyCollection, PaymentMode, PaymentReportData, WeekdayPattern } from '@/types/monthly';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PaymentReportData | { message: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { academicYearId, branchId, month, includeAllBranches } = req.body;

    if (!academicYearId || !month) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Fetch the academic year details
    const academicYear = await prisma.academicYear.findUnique({
      where: {
        id: parseInt(academicYearId)
      }
    });

    if (!academicYear) {
      return res.status(404).json({ message: 'Academic year not found' });
    }

    const academicStartDate = new Date(academicYear.startDate);
    const academicEndDate = new Date(academicYear.endDate);
    const monthNum = parseInt(month);

    // Determine the correct year based on academic year dates and selected month
    let selectedYear;
    const academicStartMonth = academicStartDate.getMonth() + 1;
    const academicEndMonth = academicEndDate.getMonth() + 1;

    if (monthNum >= academicStartMonth) {
      selectedYear = academicStartDate.getFullYear();
    } else if (monthNum <= academicEndMonth) {
      selectedYear = academicEndDate.getFullYear();
    } else {
      return res.status(400).json({ 
        message: `Selected month (${monthNum}) is outside the academic year range (${academicStartMonth}-${academicEndMonth})`
      });
    }

    // Calculate date range for the selected month
    const startDate = new Date(selectedYear, monthNum - 1, 1);
    const endDate = new Date(selectedYear, monthNum, 0);

    // Build the where clause based on whether all branches are included
    const whereClause = {
        academicYearId: parseInt(academicYearId),
        collectedDate: {
          gte: startDate,
          lte: endDate,
        },
        ...(includeAllBranches ? {} : { branchId: parseInt(branchId) })
      };
  
      const payments = await prisma.payment.findMany({
        where: whereClause,
        include: {
          account: true,
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          branch: true
        },
        orderBy: {
          collectedDate: 'desc'
        }
      });
  
      // Process daily collections with branch information
      const dailyCollections = Array.from(
        { length: endDate.getDate() },
        (_, i) => {
          const date = new Date(selectedYear, monthNum - 1, i + 1);
          const dateStr = date.toISOString().split('T')[0];
          const dayPayments = payments.filter(
            p => new Date(p.collectedDate).toISOString().split('T')[0] === dateStr
          );
  
          const collection: DailyCollection = {
            date: dateStr,
            amount: dayPayments.reduce((sum, p) => sum + p.amount, 0),
            transactions: dayPayments.length
          };
  
          if (includeAllBranches) {
            collection.branchWise = dayPayments.reduce((acc, p) => {
              const branchName = p.branch.name;
              if (!acc[branchName]) {
                acc[branchName] = { amount: 0, count: 0 };
              }
              acc[branchName].amount += p.amount;
              acc[branchName].count += 1;
              return acc;
            }, {} as Record<string, BranchWiseStats>);
          }
  
          return collection;
        }
      );
  
      // Calculate branch-wise totals
      const branchWise = includeAllBranches ? 
        payments.reduce((acc, payment) => {
          const branchName = payment.branch.name;
          if (!acc[branchName]) {
            acc[branchName] = { amount: 0, count: 0 };
          }
          acc[branchName].amount += payment.amount;
          acc[branchName].count += 1;
          return acc;
        }, {} as Record<string, BranchWiseStats>) : undefined;
  
      // Peak collections calculation
      const peakCollections = [...dailyCollections]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
        .map(day => ({
          date: day.date,
          amount: day.amount
        }));
  
      // Weekday patterns calculation
      const weekdayPatterns = payments.reduce((acc, payment) => {
        const weekday = new Date(payment.collectedDate).getDay();
        acc[weekday] = (acc[weekday] || 0) + payment.amount;
        return acc;
      }, {} as WeekdayPattern);
  
      const response: PaymentReportData = {
        totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
        paymentModes: payments.reduce((acc, payment) => {
          const mode = payment.paymentMode;
          if (!acc[mode]) {
            acc[mode] = { amount: 0, count: 0 };
          }
          acc[mode].amount += payment.amount;
          acc[mode].count += 1;
          return acc;
        }, {} as Record<string, PaymentMode>),
        dailyCollections,
        accountBreakdown: payments.reduce((acc, payment) => {
          const accountName = payment.account.accountName;
          acc[accountName] = (acc[accountName] || 0) + payment.amount;
          return acc;
        }, {} as Record<string, number>),
        statistics: {
          totalTransactions: payments.length,
          averageTransactionValue: payments.length > 0 
            ? payments.reduce((sum, p) => sum + p.amount, 0) / payments.length 
            : 0,
          peakCollections,
          weekdayPatterns,
          branchWise
        },
        payments: payments.map(p => ({
          id: p.id,
          receiptNumber: p.receiptNumber,
          collectedDate: p.collectedDate.toISOString(),
          studentId: p.studentId,
          studentName: `${p.student.firstName} ${p.student.lastName}`,
          amount: p.amount,
          paymentMode: p.paymentMode,
          accountName: p.account.accountName,
          collectedBy: p.collectedBy,
          branchName: p.branch.name
        })),
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          academicYear: {
            startDate: academicStartDate.toISOString(),
            endDate: academicEndDate.toISOString()
          }
        }
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.error('Error generating monthly report:', error);
      res.status(500).json({ message: 'Error generating report' });
    }
  }