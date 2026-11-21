import React, { useMemo } from 'react';
import { format } from "date-fns";
import _ from 'lodash';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Payment } from '@/types/payment';

interface BranchSummary {
  total: number;
  cash: number;
  online: number;
  count: number;
}

interface PaymentModeSummary {
  amount: number;
  count: number;
  percentage: string;
}

interface SummaryData {
  totalAmount: number;
  branchSummary: Record<string, BranchSummary>;
  paymentModeSummary: Record<string, PaymentModeSummary>;
  totalTransactions: number;
}

interface PaymentTableProps {
  payments: Payment[];
  schoolName?: string; // Make schoolName an optional prop
}

const DEFAULT_SCHOOL_NAME = "ABC Group of Educational Institution";

export const PaymentTable: React.FC<PaymentTableProps> = ({ 
  payments, 
  schoolName = DEFAULT_SCHOOL_NAME 
}) => {
  const summaryData = useMemo<SummaryData>(() => {
    const totalAmount = _.sumBy(payments, 'amount');
    
    const branchSummary = _.chain(payments)
      .groupBy('branchName')
      .mapValues(branchPayments => ({
        total: _.sumBy(branchPayments, 'amount'),
        cash: _.sumBy(branchPayments.filter(p => p.paymentMode.toLowerCase() === 'cash'), 'amount'),
        online: _.sumBy(branchPayments.filter(p => p.paymentMode.toLowerCase() !== 'cash'), 'amount'),
        count: branchPayments.length
      }))
      .value();
    
    const paymentModeSummary = _.chain(payments)
      .groupBy('paymentMode')
      .mapValues(modePayments => ({
        amount: _.sumBy(modePayments, 'amount'),
        count: modePayments.length,
        percentage: ((_.sumBy(modePayments, 'amount') / totalAmount) * 100).toFixed(1)
      }))
      .value();

    return {
      totalAmount,
      branchSummary,
      paymentModeSummary,
      totalTransactions: payments.length
    };
  }, [payments]);

  const handleExportExcel = () => {
    const currentDate = format(new Date(), 'dd-MM-yyyy');
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);
    
    // Set column widths
    const colWidths = [
      { wch: 20 },  // Receipt No
      { wch: 15 },  // Date
      { wch: 30 },  // Student Name
      { wch: 20 },  // Class & Section
      { wch: 25 },  // Branch
      { wch: 25 },  // Account
      { wch: 15 },  // Term
      { wch: 15 },  // Amount
      { wch: 15 },  // Payment Mode
      { wch: 15 },  // Collected By
      { wch: 20 },  // Reference
    ];
    
    // Set row heights
    ws['!rows'] = [
      { hpt: 30 },  // School name
      { hpt: 25 },  // Report title
      { hpt: 25 },  // Report date
    ];
    ws['!cols'] = colWidths;

    // Define styles
    const titleStyle = {
      font: { bold: true, size: 16 },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
        top: { style: 'thick', color: { rgb: "000000" } },
        bottom: { style: 'thick', color: { rgb: "000000" } },
        left: { style: 'thick', color: { rgb: "000000" } },
        right: { style: 'thick', color: { rgb: "000000" } }
      }
    };

    const headerStyle = {
      font: { bold: true, size: 12 },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
        top: { style: 'thick', color: { rgb: "000000" } },
        bottom: { style: 'thick', color: { rgb: "000000" } },
        left: { style: 'thick', color: { rgb: "000000" } },
        right: { style: 'thick', color: { rgb: "000000" } }
      },
      fill: { fgColor: { rgb: "E8E8E8" } }
    };

    const sectionHeaderStyle = {
      font: { bold: true, size: 12 },
      alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
      border: {
        top: { style: 'medium', color: { rgb: "000000" } },
        bottom: { style: 'medium', color: { rgb: "000000" } },
        left: { style: 'medium', color: { rgb: "000000" } },
        right: { style: 'medium', color: { rgb: "000000" } }
      },
      fill: { fgColor: { rgb: "F0F0F0" } }
    };

    const cellStyle = {
      font: { size: 11 },
      alignment: { 
        horizontal: 'left', 
        vertical: 'center', 
        wrapText: true,
        indent: 1
      },
      border: {
        top: { style: 'thin', color: { rgb: "000000" } },
        bottom: { style: 'thin', color: { rgb: "000000" } },
        left: { style: 'thin', color: { rgb: "000000" } },
        right: { style: 'thin', color: { rgb: "000000" } }
      }
    };

    const numericCellStyle = {
      ...cellStyle,
      alignment: { 
        horizontal: 'right', 
        vertical: 'center', 
        wrapText: true 
      }
    };

    // Add school name header
    XLSX.utils.sheet_add_aoa(ws, [[schoolName]], { origin: 'A1' });
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }];
    
    // Add report title and date
    XLSX.utils.sheet_add_aoa(ws, [
      ['FINANCIAL COLLECTION REPORT'],
      [`Report Generated: ${format(new Date(), 'dd MMMM yyyy HH:mm')}`],
      ['']
    ], { origin: 'A2' });

    // Add summary section
    XLSX.utils.sheet_add_aoa(ws, [
      ['SUMMARY INFORMATION'],
      [`Total Collections: ₹${summaryData.totalAmount.toLocaleString('en-IN')}`],
      [`Total Transactions: ${summaryData.totalTransactions}`],
      ['']
    ], { origin: 'A5' });

    // Add payment mode analysis
    XLSX.utils.sheet_add_aoa(ws, [
      ['Payment Mode Analysis'],
      ['Mode', 'Amount (₹)', 'Transactions', 'Share (%)']
    ], { origin: 'A9' });

    let currentRow = 11;
    Object.entries(summaryData.paymentModeSummary).forEach(([mode, data]) => {
      XLSX.utils.sheet_add_aoa(ws, [[
        mode,
        data.amount.toLocaleString('en-IN'),
        data.count.toString(),
        `${data.percentage}%`
      ]], { origin: `A${currentRow}` });
      currentRow++;
    });

    // Add transaction details
    currentRow += 2;
    const headers = [
      'Receipt No.',
      'Date',
      'Student Name',
      'Class & Section',
      'Branch',
      'Account',
      'Term',
      'Amount (₹)',
      'Payment Mode',
      'Collected By',
      'Reference'
    ];

    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: `A${currentRow}` });
    
    // Add transaction data
    const transactionData = payments.map(payment => [
      payment.receiptNumber,
      format(new Date(payment.collectedDate), 'dd/MM/yyyy'),
      payment.studentName || '-',
      payment.className && payment.sectionName
        ? `${payment.className} - ${payment.sectionName}`
        : '-',
      payment.branchName || '-',
      payment.accountName || '-',
      payment.term || '-',
      payment.amount.toLocaleString('en-IN'),
      payment.paymentMode,
      payment.collectedBy,
      payment.reference || '-'
    ]);

    XLSX.utils.sheet_add_aoa(ws, transactionData, { origin: `A${currentRow + 1}` });

    // Apply styles to all cells
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!ws[cell_ref]) continue;
        
        // Apply specific styles based on row type
        if (R === 0) {
          // School name header
          ws[cell_ref].s = titleStyle;
        } else if (R === 1) {
          // Report title
          ws[cell_ref].s = headerStyle;
        } else if (R === currentRow) {
          // Table headers
          ws[cell_ref].s = headerStyle;
        } else if (ws[cell_ref].v === 'SUMMARY INFORMATION' || 
                  ws[cell_ref].v === 'Payment Mode Analysis') {
          // Section headers
          ws[cell_ref].s = sectionHeaderStyle;
        } else if (C === 7 || // Amount column
                  (R >= 11 && R < currentRow && C === 1)) { // Payment mode analysis amounts
          ws[cell_ref].s = numericCellStyle;
        } else {
          // Regular cells
          ws[cell_ref].s = cellStyle;
        }
      }
    }
    
    // Add an outline border around the entire table
    const outline = {
      style: 'thick',
      color: { rgb: "000000" }
    };
    
    ws['!outline'] = {
      top: outline,
      bottom: outline,
      left: outline,
      right: outline
    };

    // Add to workbook and save
    XLSX.utils.book_append_sheet(wb, ws, "Financial Report");
    XLSX.writeFile(wb, `Financial_Report_${currentDate}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader className="bg-white rounded-md shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Financial Collections
              </CardTitle>
              <CardDescription className="mt-2 text-lg">
                {format(new Date(), 'dd MMMM yyyy')} • {summaryData.totalTransactions} transactions
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={handleExportExcel} 
              className="gap-2 hover:bg-white/90 border-blue-200"
            >
              <Download className="h-4 w-4 mr-2 text-blue-600" />
              Export Report
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>Complete list of all financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">Receipt No</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Collected By</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                    <TableCell>{payment.studentName || '-'}</TableCell>
                    <TableCell>
                      {payment.className && payment.sectionName 
                        ? `${payment.className} - ${payment.sectionName}`
                        : '-'}
                    </TableCell>
                    <TableCell>{payment.branchName || '-'}</TableCell>
                    <TableCell>{payment.accountName || '-'}</TableCell>
                    <TableCell>{payment.term || '-'}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{payment.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        payment.paymentMode.toLowerCase() === 'cash' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {payment.paymentMode}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(payment.collectedDate), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{payment.collectedBy}</TableCell>
                    <TableCell>{payment.reference || '-'}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={6} className="text-right">Total ({summaryData.totalTransactions} transactions):</TableCell>
                  <TableCell className="text-right">₹{summaryData.totalAmount.toLocaleString('en-IN')}</TableCell>
                  <TableCell colSpan={4}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTable;