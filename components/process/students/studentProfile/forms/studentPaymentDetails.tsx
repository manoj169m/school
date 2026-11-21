import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  DollarSign,
  History,
  School,
  TrendingDown,
  User,
} from "lucide-react";
import { PastPaymentsDialog } from "@/components/process/finance/incomeCollection/dialog/pastPayments";

// Basic interfaces
interface Account {
  accountName: string;
}

interface Concession {
  concessionId?: number;
  accountId: number;
  amount: number;
  reason?: string;
  term: string;
  account: {
    accountName: string;
  };
}

interface FeeData {
  studentDetails: {
    name: string;
    academicYear: string;
    class: string;
    section: string;
    branch: string;
    fatherName: string;
    contactNo: string;
    phoneNo: string;
    admissionNo: string;
    rollNo: string;
  };
  studentFeeId: number;
  studentId: number;
  enrollmentId: number;
  academicYearId: number;
  classId: number;
  sectionId: number;
  branchId: number;
  regularFees: {
    accountId: number;
    amount: number;
    dueDate: string;
    term: string;
    account: {
      accountName: string;
    };
  }[];
  transportFee: {
    accountId: number;
    amount: number;
    dueDate: string;
    term: string;
    account: {
      accountName: string;
    };
  } | null;
  hostelFee: {
    accountId: number;
    amount: number;
    dueDate: string;
    term: string;
    account: {
      accountName: string;
    };
  } | null;
  individualFees: {
    accountId: number;
    amount: number;
    term: string;
    account: {
      accountName: string;
    };
  }[];
  concessions: Concession[];
  payments: {
    accountId: number;
    amount: number;
    term: string;
    account: {
      accountName: string;
    };
  }[];
}

interface PaymentDetail {
  amount: number;
  collectedDate: string;
  receiptNumber: string;
  paymentMode?: string;
  bankName?: string;
  reference?: string;
}

interface Fee {
  accountId: number;
  amount: number;
  dueDate: string;
  term: number;
  account: Account;
}

interface Payment {
  accountId: number;
  amount: number;
  term: number;
  account: Account;
  paymentDetails: PaymentDetail[];
}

// Student related interfaces
interface StudentDetails {
  name: string;
  fatherName: string;
  branch: string;
  contactNo: string;
  phoneNo: string;
  class: string;
  section: string;
  academicYear: string;
  admissionNo: string;
  rollNo: string;
}

// Main data interface
interface StudentData {
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
  concessions: Concession[];
  payments: Payment[];
}

// Props interface
interface PaymentDetailsProps {
  studentData: StudentData;
}

// Component interfaces
interface StatusBadgeProps {
  status: "Overdue" | "Upcoming" | "Paid";
}

interface PaymentSummary {
  totalFee: number;
  totalPaid: number;
  totalConcession: number;
  dueAmount: number;
}

// Helper function to transform StudentData to FeeData
const transformToFeeData = (studentData: StudentData): FeeData => {
  return {
    studentDetails: {
      name: studentData.studentDetails.name,
      academicYear: studentData.studentDetails.academicYear,
      class: studentData.studentDetails.class,
      section: studentData.studentDetails.section,
      branch: studentData.studentDetails.branch,
      fatherName: studentData.studentDetails.fatherName,
      contactNo: studentData.studentDetails.contactNo,
      phoneNo: studentData.studentDetails.phoneNo,
      admissionNo: studentData.studentDetails.admissionNo,
      rollNo: studentData.studentDetails.rollNo,
    },
    studentFeeId: studentData.studentFeeId,
    studentId: studentData.studentId,
    enrollmentId: studentData.enrollmentId,
    academicYearId: studentData.academicYearId,
    classId: studentData.classId,
    sectionId: studentData.sectionId,
    branchId: studentData.branchId,
    regularFees: studentData.regularFees.map((fee) => ({
      ...fee,
      term: fee.term.toString(),
    })),
    transportFee: studentData.transportFee
      ? {
          ...studentData.transportFee,
          term: studentData.transportFee.term.toString(),
        }
      : null,
    hostelFee: studentData.hostelFee
      ? {
          ...studentData.hostelFee,
          term: studentData.hostelFee.term.toString(),
        }
      : null,
    individualFees: studentData.individualFees.map((fee) => ({
      ...fee,
      term: fee.term.toString(),
    })),
    concessions: studentData.concessions,
    payments: studentData.payments.map((payment) => ({
      ...payment,
      term: payment.term.toString(),
    })),
  };
};

// Helper Components
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "Overdue":
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Overdue
        </Badge>
      );
    case "Upcoming":
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Upcoming
        </Badge>
      );
    case "Paid":
      return <Badge className="bg-green-600 hover:bg-green-600">Paid</Badge>;
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to calculate payment totals
const calculateTotals = (
  fees: Fee[],
  payments: Payment[],
  concessions: Concession[]
): PaymentSummary => {
  const totalFee = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = payments.reduce(
    (sum, payment) =>
      sum +
      payment.paymentDetails.reduce((pSum, detail) => pSum + detail.amount, 0),
    0
  );
  const totalConcession = concessions.reduce(
    (sum, concession) => sum + concession.amount,
    0
  );
  const dueAmount = Math.max(0, totalFee - totalPaid - totalConcession);

  return { totalFee, totalPaid, totalConcession, dueAmount };
};

// Main Component
const PaymentDetails: React.FC<PaymentDetailsProps> = ({ studentData }) => {
  const [isPastPaymentsOpen, setIsPastPaymentsOpen] = useState<boolean>(false);

  // Combine all fees
  const allFees: Fee[] = [
    ...studentData.regularFees,
    ...(studentData.transportFee ? [studentData.transportFee] : []),
    ...(studentData.hostelFee ? [studentData.hostelFee] : []),
    ...studentData.individualFees,
    // Add any fees that exist in payments but not in the regular fee structure
    ...studentData.payments
      .filter(
        (payment) =>
          !studentData.regularFees.some(
            (fee) =>
              fee.accountId === payment.accountId && fee.term === payment.term
          ) &&
          !studentData.individualFees.some(
            (fee) =>
              fee.accountId === payment.accountId && fee.term === payment.term
          ) &&
          payment.accountId !== studentData?.transportFee?.accountId &&
          payment.accountId !== studentData?.hostelFee?.accountId
      )
      .map((payment) => ({
        accountId: payment.accountId,
        amount: payment.amount,
        term: payment.term,
        dueDate: new Date().toISOString(), // Default due date for historical payments
        account: payment.account,
      })),
  ];

  // Function to get concession amount for a specific fee
  const getConcessionAmount = (accountId: number, term: number): number => {
    const concession = studentData.concessions.find(
      (c) => c.accountId === accountId && Number(c.term) === term
    );
    return concession ? concession.amount : 0;
  };

  // Calculate payment summary
  const paymentSummary = calculateTotals(
    allFees,
    studentData.payments,
    studentData.concessions
  );

  const feeData = transformToFeeData(studentData);

  return (
    <div className="min-h-screen bg-white rounded-xl shadow-xl mt-5 ">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-800">
                Payment Details - {studentData.studentDetails.academicYear}
              </h1>
            </div>
            <div className="flex gap-3">
              <Button
                className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                onClick={() => setIsPastPaymentsOpen(true)}
              >
                <History className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Past Payments
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-3 bg-red-50 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center h-10 w-10 bg-red-600 rounded-full">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-600">
                  Student Name:
                </span>
                <span className="text-base text-gray-800 font-bold">
                  {studentData.studentDetails.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-red-50 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center h-10 w-10 bg-red-600 rounded-full">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-600">
                  Class & Section:
                </span>
                <span className="text-base text-gray-800 font-bold">
                  {`${studentData.studentDetails.class} - ${studentData.studentDetails.section}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-red-50 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center h-10 w-10 bg-red-600 rounded-full">
                <School className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-600">
                  Branch:
                </span>
                <span className="text-base text-gray-800 font-bold">
                  {studentData.studentDetails.branch}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 -mt-8">
          {[
            {
              title: "Total Amount",
              value: paymentSummary.totalFee,
              icon: <DollarSign className="w-5 h-5" />,
              color: "from-blue-500 to-blue-600",
            },
            {
              title: "Amount Paid",
              value: paymentSummary.totalPaid,
              icon: <CheckCircle2 className="w-5 h-5" />,
              color: "from-green-500 to-green-600",
            },
            {
              title: "Current Payment",
              value: paymentSummary.totalConcession,
              icon: <TrendingDown className="w-5 h-5" />,
              color: "from-purple-500 to-purple-600",
            },
            {
              title: "Pending Amount",
              value: paymentSummary.dueAmount,
              icon: <Clock className="w-5 h-5" />,
              color: "from-orange-500 to-orange-600",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-10 ${stat.color}" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="p-6">
          <Card className="shadow-lg ">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-blue-800">
                Students Payments Details Table
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="font-semibold text-gray-700">
                            Account Name
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Term
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Due Date
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 text-right">
                            Amount
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 text-right">
                            Concession
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 text-right">
                            Paid
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 text-right">
                            Pending
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allFees.map((fee, index) => {
                          const payment = studentData.payments.find(
                            (p) =>
                              p.accountId === fee.accountId &&
                              p.term === fee.term
                          );
                          const paidAmount = payment
                            ? payment.paymentDetails.reduce(
                                (sum, detail) => sum + detail.amount,
                                0
                              )
                            : 0;
                          const concessionAmount = getConcessionAmount(
                            fee.accountId,
                            fee.term
                          );
                          const pendingAmount = Math.max(
                            0,
                            fee.amount - paidAmount - concessionAmount
                          );
                          const status =
                            paidAmount + concessionAmount >= fee.amount
                              ? "Paid"
                              : new Date() > new Date(fee.dueDate)
                              ? "Overdue"
                              : "Upcoming";

                          return (
                            <TableRow
                              key={index}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <TableCell className="font-medium text-gray-900">
                                {fee.account.accountName}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {fee.term}
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={status} />
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {new Date(fee.dueDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </TableCell>
                              <TableCell className="text-right font-medium text-gray-900">
                                {formatCurrency(fee.amount)}
                              </TableCell>
                              <TableCell className="text-right text-gray-700">
                                {formatCurrency(concessionAmount)}
                              </TableCell>
                              <TableCell className="text-right text-green-600 font-medium">
                                {formatCurrency(paidAmount)}
                              </TableCell>
                              <TableCell className="text-right text-red-600 font-medium">
                                {formatCurrency(pendingAmount)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                      <TableFooter className="bg-blue-50">
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="font-semibold text-gray-900"
                          >
                            Total
                          </TableCell>
                          <TableCell className="text-right font-semibold text-gray-900">
                            {formatCurrency(paymentSummary.totalFee)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-gray-900">
                            {formatCurrency(paymentSummary.totalConcession)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            {formatCurrency(paymentSummary.totalPaid)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-red-600">
                            {formatCurrency(paymentSummary.dueAmount)}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Past Payments Dialog */}
      <PastPaymentsDialog
        isOpen={isPastPaymentsOpen}
        onClose={() => setIsPastPaymentsOpen(false)}
        payments={feeData.payments}
        feeData={feeData}
      />
    </div>
  );
};

export default PaymentDetails;
