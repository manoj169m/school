import { useMemo } from 'react';
import _ from 'lodash';
import { format } from 'date-fns';
import type { Payment } from '../types/payment';
import type {
  BranchSummary,
  ClassSummary,
  AccountSummary,
  CollectorSummary,
  BranchMatrix,
  PaymentTrend
} from '@/types/payment/incomeReport';
import { TermSummary } from '@/components/process/finance/collectionReport/reports/TermAnalysis';

export const useReportCalculations = (payments: Payment[]) => {
  // Branch-wise summary calculation
  const branchWiseSummary = useMemo(() => 
    _.chain(payments)
      .groupBy('branchName')
      .mapValues((branchPayments): BranchSummary => ({
        total: _.sumBy(branchPayments, 'amount'),
        cashTotal: _.sumBy(_.filter(branchPayments, { paymentMode: 'Cash' }), 'amount'),
        onlineTotal: _.sumBy(_.filter(branchPayments, { paymentMode: 'Online' }), 'amount'),
        studentCount: _.uniqBy(branchPayments, 'studentName').length,
        accountBreakdown: _.chain(branchPayments)
          .groupBy('accountName')
          .mapValues(acc => _.sumBy(acc, 'amount'))
          .value()
      }))
      .value(),
    [payments]
  );

  // Class-wise summary calculation
  const classWiseSummary = useMemo(() => 
    _.chain(payments)
      .groupBy(payment => `${payment.branchName}-${payment.className}`)
      .mapValues((classPayments): ClassSummary => {
        // Ensure we have valid data for required fields
        const firstPayment = classPayments[0];
        if (!firstPayment || !firstPayment.branchName || !firstPayment.className) {
          console.warn('Invalid class payment data found:', firstPayment);
          return {
            branch: 'Unknown Branch',
            class: 'Unknown Class',
            total: 0,
            studentCount: 0,
            sectionBreakdown: {}
          };
        }
  
        return {
          branch: firstPayment.branchName,
          class: firstPayment.className,
          total: _.sumBy(classPayments, 'amount'),
          studentCount: _.uniqBy(classPayments, 'studentName').length,
          sectionBreakdown: _.chain(classPayments)
            .groupBy('sectionName')
            .mapValues(sec => ({
              total: _.sumBy(sec, 'amount'),
              students: _.uniqBy(sec, 'studentName').length
            }))
            .value()
        };
      })
      .value(),
    [payments]
  );
//Term wise
  // Inside useReportCalculations hook, update the termWiseSummary calculation:

  const termWiseSummary = useMemo(() => 
    _.chain(payments)
      .groupBy(payment => `${payment.accountName}-${payment.term}`)
      .mapValues((termPayments): TermSummary => {
        const uniqueStudents = _.uniqBy(termPayments, 'studentName');
        const totalStudents = uniqueStudents.length;
        const accountName = termPayments[0]?.accountName || 'Unknown Account';
        
        // Create a safe record for account breakdown
        const accountBreakdown: Record<string, number> = {};
        accountBreakdown[accountName] = _.sumBy(termPayments, 'amount');
        
        return {
          total: _.sumBy(termPayments, 'amount'),
          cashTotal: _.sumBy(_.filter(termPayments, { paymentMode: 'Cash' }), 'amount'),
          onlineTotal: _.sumBy(_.filter(termPayments, { paymentMode: 'Online' }), 'amount'),
          studentCount: totalStudents,
          pendingCount: 0,
          completedCount: totalStudents,
          accountBreakdown,
          classBreakdown: _.chain(termPayments)
            .groupBy(p => `${p.className}-${p.sectionName}`)
            .mapValues(cls => _.sumBy(cls, 'amount'))
            .value(),
          dailyTrend: _.chain(termPayments)
            .groupBy(p => format(new Date(p.collectedDate), 'yyyy-MM-dd'))
            .mapValues(day => _.sumBy(day, 'amount'))
            .value()
        };
      })
      .value(),
    [payments]
  );

  // Account-wise summary calculation
  const accountWiseSummary = useMemo(() => 
    _.chain(payments)
      .groupBy('accountName')
      .mapValues((accountPayments): AccountSummary => ({
        total: _.sumBy(accountPayments, 'amount'),
        cashTotal: _.sumBy(_.filter(accountPayments, { paymentMode: 'Cash' }), 'amount'),
        onlineTotal: _.sumBy(_.filter(accountPayments, { paymentMode: 'Online' }), 'amount'),
        studentCount: _.uniqBy(accountPayments, 'studentName').length,
        branchBreakdown: _.chain(accountPayments)
          .groupBy('branchName')
          .mapValues(branch => _.sumBy(branch, 'amount'))
          .value(),
        monthlyTrend: _.chain(accountPayments)
          .groupBy(p => format(new Date(p.collectedDate), 'MMM yyyy'))
          .mapValues(month => _.sumBy(month, 'amount'))
          .value()
      }))
      .value(),
    [payments]
  );

  // Collector-wise summary calculation
  const collectorWiseSummary = useMemo(() => 
    _.chain(payments)
      .groupBy('collectedBy')
      .mapValues((collectorPayments): CollectorSummary => ({
        total: _.sumBy(collectorPayments, 'amount'),
        cashTotal: _.sumBy(_.filter(collectorPayments, { paymentMode: 'Cash' }), 'amount'),
        onlineTotal: _.sumBy(_.filter(collectorPayments, { paymentMode: 'Online' }), 'amount'),
        transactionCount: collectorPayments.length,
        branchWise: _.chain(collectorPayments)
          .groupBy('branchName')
          .mapValues(branch => ({
            total: _.sumBy(branch, 'amount'),
            transactions: branch.length
          }))
          .value(),
        dailyAverage: _.sumBy(collectorPayments, 'amount') / 
          _.uniqBy(collectorPayments, p => format(new Date(p.collectedDate), 'yyyy-MM-dd')).length
      }))
      .value(),
    [payments]
  );

  // Payment mode trends calculation
  const paymentModeTrends = useMemo(() => 
    _.chain(payments)
      .groupBy(payment => format(new Date(payment.collectedDate), 'MMM yyyy'))
      .mapValues((datePayments): PaymentTrend => ({
        total: _.sumBy(datePayments, 'amount'),
        cash: _.sumBy(_.filter(datePayments, { paymentMode: 'Cash' }), 'amount'),
        online: _.sumBy(_.filter(datePayments, { paymentMode: 'Online' }), 'amount'),
        transactions: datePayments.length
      }))
      .value(),
    [payments]
  );

  // Matrix summary calculation
  const matrixSummary = useMemo(() => 
    _.chain(payments)
      .groupBy('branchName')
      .mapValues((branchPayments): BranchMatrix => ({
        total: _.sumBy(branchPayments, 'amount'),
        accounts: _.chain(branchPayments)
          .groupBy('accountName')
          .mapValues(accountPayments => ({
            total: _.sumBy(accountPayments, 'amount'),
            modes: {
              cash: _.sumBy(_.filter(accountPayments, { paymentMode: 'Cash' }), 'amount'),
              online: _.sumBy(_.filter(accountPayments, { paymentMode: 'Online' }), 'amount')
            },
            studentCount: _.uniqBy(accountPayments, 'studentName').length
          }))
          .value()
      }))
      .value(),
    [payments]
  );

  // Overall summary calculations
  const overallSummary = useMemo(() => ({
    totalCollection: _.sumBy(payments, 'amount'),
    totalStudents: _.uniqBy(payments, 'studentName').length,
    totalBranches: _.uniqBy(payments, 'branchName').length,
    totalCollectors: _.uniqBy(payments, 'collectedBy').length,
    cashPercentage: (_.sumBy(_.filter(payments, { paymentMode: 'Cash' }), 'amount') / _.sumBy(payments, 'amount')) * 100,
    onlinePercentage: (_.sumBy(_.filter(payments, { paymentMode: 'Online' }), 'amount') / _.sumBy(payments, 'amount')) * 100
  }), [payments]);

  return {
    branchWiseSummary,
    classWiseSummary,
    accountWiseSummary,
    collectorWiseSummary,
    paymentModeTrends,
    matrixSummary,
    overallSummary,
    termWiseSummary,
  };
};