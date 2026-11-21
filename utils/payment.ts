import { format } from "date-fns";
import * as XLSX from 'xlsx';
import { Payment, PaymentSummary } from "@/types/payment";
import _ from 'lodash';

export const calculateSummary = (data: Payment[]): PaymentSummary => {
  const totalAmount = _.sumBy(data, 'amount');
  
  const modeWiseTotal = _.groupBy(data, 'paymentMode');
  const accountWiseTotal = _.groupBy(data, 'accountName');
  const branchWiseTotal = _.groupBy(data, 'branchName');

  return {
    totalAmount,
    modeWiseTotal: _.mapValues(modeWiseTotal, (group: Payment[]) => _.sumBy(group, 'amount')),
    accountWiseTotal: _.mapValues(accountWiseTotal, (group: Payment[]) => _.sumBy(group, 'amount')),
    branchWiseTotal: _.mapValues(branchWiseTotal, (group: Payment[]) => _.sumBy(group, 'amount'))
  };
};

export const exportToExcel = (payments: Payment[]): void => {
  const exportData = payments.map(payment => ({
    'Receipt No': payment.receiptNumber,
    'Student': payment.studentName,
    'Class': `${payment.className} - ${payment.sectionName}`,
    'Branch': payment.branchName,
    'Account': payment.accountName,
    'Amount': payment.amount,
    'Mode': payment.paymentMode,
    'Date': format(new Date(payment.collectedDate), 'dd/MM/yyyy'),
    'Collected By': payment.collectedBy,
    'Reference': payment.reference || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
  XLSX.writeFile(workbook, `payment_report_${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
};