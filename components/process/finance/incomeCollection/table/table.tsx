import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ConcessionDialog from "../dialog/concession";
import { Input } from "@/components/ui/input";
import {
  BadgePercent,
  Plus,
  History,
  AlertCircle,
  CreditCard,
  DollarSign,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddFeeDialog } from "../dialog/addFee";
import { PastPaymentsDialog } from "../dialog/pastPayments";
import { FeeData, FeeDetail } from "@/types/income";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface FeeDetailsTableProps {
  feeData: FeeData;
  feeDetails: FeeDetail[];
  onFeeDetailsChange: (details: FeeDetail[]) => void;
  onSuccess?: () => Promise<void>;
  isRefreshing?: boolean;
}

export function FeeDetailsTable({ feeData, feeDetails, onFeeDetailsChange, onSuccess,
  isRefreshing }: FeeDetailsTableProps) {
  const [bulkAmount, setBulkAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});
  const [isConcessionDialogOpen, setIsConcessionDialogOpen] = useState(false);
  const [isAddFeeDialogOpen, setIsAddFeeDialogOpen] = useState(false);
  const [isPastPaymentsOpen, setIsPastPaymentsOpen] = useState(false);

  const processFees = (fees: FeeData['regularFees'], individualFees: FeeData['individualFees']) => {
    if (!fees?.length && !individualFees?.length) return [];

    // Create a map of accountId and term to individual fee amounts
    const individualFeesMap = new Map<string, number>();
    individualFees?.forEach(fee => {
      const key = `${fee.accountId}-${fee.term}`;
      individualFeesMap.set(key, (individualFeesMap.get(key) || 0) + (fee.amount || 0));
    });

    // Process regular fees and combine with individual fees
    const processedFees = (fees || []).map(fee => {
      if (!fee?.accountId || !fee.account) return null;

      const key = `${fee.accountId}-${fee.term}`;
      const individualFeeAmount = individualFeesMap.get(key) || 0;

      const concessions = feeData.concessions
        ?.filter(c => c.accountId === fee.accountId && c.term === fee.term)
        ?.reduce((sum, c) => sum + (c?.amount || 0), 0) || 0;

      const payments = feeData.payments
        ?.filter(p => p.accountId === fee.accountId && p.term === fee.term)
        ?.reduce((sum, p) => sum + (p?.amount || 0), 0) || 0;

      const totalAmount = (fee.amount || 0) + individualFeeAmount;
      const pending = totalAmount - concessions - payments;

      return {
        accountId: fee.accountId,
        accountName: fee.account.accountName,
        term: fee.term,
        dueDate: fee.dueDate || '-',
        amount: totalAmount,
        concession: concessions,
        paid: payments,
        pending,
        currentPayment: "0"
      };
    }).filter((fee): fee is FeeDetail => fee !== null);

    // Add individual fees that don't have corresponding regular fees
    individualFees?.forEach(fee => {
      if (!fee?.accountId || !fee.account) return;

      const existingFee = processedFees.find(f => 
        f.accountId === fee.accountId && f.term === fee.term
      );

      if (!existingFee) {
        const concessions = feeData.concessions
          ?.filter(c => c.accountId === fee.accountId && c.term === fee.term)
          ?.reduce((sum, c) => sum + (c?.amount || 0), 0) || 0;

        const payments = feeData.payments
          ?.filter(p => p.accountId === fee.accountId && p.term === fee.term)
          ?.reduce((sum, p) => sum + (p?.amount || 0), 0) || 0;

        const pending = (fee.amount || 0) - concessions - payments;

        processedFees.push({
          accountId: fee.accountId,
          accountName: fee.account.accountName,
          term: fee.term,
          dueDate: '-',
          amount: fee.amount || 0,
          concession: concessions,
          paid: payments,
          pending,
          currentPayment: "0"
        });
      }
    });

    return processedFees;
  };

  const processTransportFee = (transportFee: FeeData['transportFee']) => {
    if (!transportFee?.accountId || !transportFee.account) return [];

    const concessions = feeData.concessions
      ?.filter(c => c.accountId === transportFee.accountId && c.term === transportFee.term)
      ?.reduce((sum, c) => sum + (c?.amount || 0), 0) || 0;

    const payments = feeData.payments
      ?.filter(p => p.accountId === transportFee.accountId && p.term === transportFee.term)
      ?.reduce((sum, p) => sum + (p?.amount || 0), 0) || 0;

    const pending = (transportFee.amount || 0) - concessions - payments;

    return [{
      accountId: transportFee.accountId,
      accountName: transportFee.account.accountName,
      term: transportFee.term,
      dueDate: transportFee.dueDate || '-',
      amount: transportFee.amount || 0,
      concession: concessions,
      paid: payments,
      pending,
      currentPayment: "0"
    }];
  };

  const processHostelFee = (hostelFee: FeeData['hostelFee']) => {
    if (!hostelFee?.accountId || !hostelFee.account) return [];

    const concessions = feeData.concessions
      ?.filter(c => c.accountId === hostelFee.accountId && c.term === hostelFee.term)
      ?.reduce((sum, c) => sum + (c?.amount || 0), 0) || 0;

    const payments = feeData.payments
      ?.filter(p => p.accountId === hostelFee.accountId && p.term === hostelFee.term)
      ?.reduce((sum, p) => sum + (p?.amount || 0), 0) || 0;

    const pending = (hostelFee.amount || 0) - concessions - payments;

    return [{
      accountId: hostelFee.accountId,
      accountName: hostelFee.account.accountName,
      term: hostelFee.term,
      dueDate: hostelFee.dueDate || '-',
      amount: hostelFee.amount || 0,
      concession: concessions,
      paid: payments,
      pending,
      currentPayment: "0"
    }];
  };

  

  useEffect(() => {
    if (!feeData) return;

    try {
      const regularFeeDetails = processFees(feeData.regularFees, feeData.individualFees);
      const transportFeeDetails = processTransportFee(feeData.transportFee);
      const hostelFeeDetails = processHostelFee(feeData.hostelFee);

      const allFeeDetails = [
        ...regularFeeDetails,
        ...transportFeeDetails,
        ...hostelFeeDetails
      ].map(detail => ({
        ...detail,
        currentPayment: ""
      }));

      onFeeDetailsChange(allFeeDetails);
    } catch (error) {
      console.error('Error processing fees:', error);
      onFeeDetailsChange([]);
    }
  }, [feeData]);

  const handleBulkAmountChange = (value: string) => {
    if (value === "") {
      setBulkAmount("");
      setError("");
      onFeeDetailsChange(feeDetails.map(detail => ({ ...detail, currentPayment: "" })));
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setError("Please enter a valid number");
      setBulkAmount(value);
      return;
    }

    const totalPending = feeDetails.reduce((sum, detail) => sum + detail.pending, 0);

    if (numValue > totalPending) {
      setError(`Amount cannot exceed total pending amount (₹${totalPending.toLocaleString('en-IN', { minimumFractionDigits: 2 })})`);
      setBulkAmount(value);
      return;
    }

    if (numValue < 0) {
      setError("Amount cannot be negative");
      setBulkAmount(value);
      return;
    }

    setError("");
    setBulkAmount(value);

    let remainingAmount = numValue;
    const updatedFeeDetails = feeDetails.map(detail => {
      if (remainingAmount <= 0) {
        return { ...detail, currentPayment: "" };
      }

      const allocation = Math.min(remainingAmount, detail.pending);
      remainingAmount -= allocation;
      return { ...detail, currentPayment: allocation.toString() };
    });

    onFeeDetailsChange(updatedFeeDetails);
  };

  const handleCurrentPaymentChange = (index: number, value: string) => {
    const newInputErrors = { ...inputErrors };
    delete newInputErrors[index];

    if (value === "") {
      setInputErrors(newInputErrors);
      onFeeDetailsChange(
        feeDetails.map((detail, i) =>
          i === index ? { ...detail, currentPayment: "" } : detail
        )
      );
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      newInputErrors[index] = "Please enter a valid number";
      setInputErrors(newInputErrors);
      return;
    }

    if (numValue < 0) {
      newInputErrors[index] = "Amount cannot be negative";
      setInputErrors(newInputErrors);
      return;
    }

    const maxAmount = feeDetails[index]?.pending || 0;
    if (numValue > maxAmount) {
      newInputErrors[index] = `Cannot exceed pending amount (₹${maxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })})`;
      setInputErrors(newInputErrors);
      return;
    }

    setInputErrors(newInputErrors);
    onFeeDetailsChange(
      feeDetails.map((detail, i) =>
        i === index ? { ...detail, currentPayment: numValue.toString() } : detail
      )
    );
  };

  const handleAddFeeSuccess = async () => {
    await onSuccess?.();
  };

  const handleConcessionSuccess = async () => {
    await onSuccess?.();
  };

  // const totalPending = feeDetails.reduce((sum, detail) => sum + detail.pending, 0);
  // const totalCurrentPayment = feeDetails.reduce((sum, detail) =>
  //   sum + (detail.currentPayment ? parseFloat(detail.currentPayment) : 0), 0);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '-') return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusInfo = (dueDate: string, pending: number) => {
    if (!dueDate || dueDate === '-') return { status: 'Not Set', color: 'text-gray-500' };
    const today = new Date();
    const due = new Date(dueDate);
    
    if (pending <= 0) return { status: 'Paid', color: 'text-green-500' };
    if (due < today) return { status: 'Overdue', color: 'text-red-500' };
    
    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 7) return { status: 'Due Soon', color: 'text-orange-500' };
    return { status: 'Upcoming', color: 'text-blue-500' };
  };

  if (!feeDetails.length) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <CreditCard className="w-16 h-16 text-gray-400" />
          <p className="text-gray-600 text-lg">
            {isRefreshing ? 'Refreshing fee details...' : !feeData ? 'Loading fee details...' : 'No fee details available'}
          </p>
        </div>
      </Card>
    );
  }

  const totalAmount = feeDetails.reduce((sum, detail) => sum + detail.amount, 0);
  const totalPaid = feeDetails.reduce((sum, detail) => sum + detail.paid, 0);
  const totalPending = feeDetails.reduce((sum, detail) => sum + detail.pending, 0);
  const totalCurrentPayment = feeDetails.reduce((sum, detail) => 
    sum + (detail.currentPayment ? parseFloat(detail.currentPayment) : 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Amount",
            value: `₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            icon: <DollarSign className="w-5 h-5" />,
            color: "from-blue-500 to-blue-600"
          },
          {
            title: "Amount Paid",
            value: `₹${totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            icon: <CheckCircle2 className="w-5 h-5" />,
            color: "from-green-500 to-green-600"
          },
          {
            title: "Pending Amount",
            value: `₹${totalPending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            icon: <Clock className="w-5 h-5" />,
            color: "from-orange-500 to-orange-600"
          },
          {
            title: "Current Payment",
            value: `₹${totalCurrentPayment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            icon: <TrendingDown className="w-5 h-5" />,
            color: "from-purple-500 to-purple-600"
          }
        ].map((stat, index) => (
          <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-r opacity-10 ${stat.color}" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader className="border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => setIsConcessionDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <BadgePercent className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Concession
              </Button>
              <Button
                onClick={() => setIsAddFeeDialogOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Add Fee
              </Button>
              <Button
                onClick={() => setIsPastPaymentsOpen(true)}
                className="bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <History className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Past Payments
              </Button>
            </div>

            <div className="w-full md:w-auto">
              <div className="relative">
                <Input
                  placeholder="Enter amount to distribute"
                  value={bulkAmount}
                  onChange={(e) => handleBulkAmountChange(e.target.value)}
                  className="w-full md:w-64 h-10 text-lg font-medium rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  max={totalPending}
                />
                {error && (
                  <Alert variant="destructive" className="mt-2 animate-shake">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableHead className="font-semibold">Account Name</TableHead>
                  <TableHead className="font-semibold text-center">Term</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                  <TableHead className="font-semibold text-center">Due Date</TableHead>
                  <TableHead className="font-semibold text-center">Amount</TableHead>
                  <TableHead className="font-semibold text-center">Concession</TableHead>
                  <TableHead className="font-semibold text-center">Paid</TableHead>
                  <TableHead className="font-semibold text-center">Pending</TableHead>
                  <TableHead className="font-semibold text-center">Current Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeDetails.map((item, index) => {
                  const status = getStatusInfo(item.dueDate, item.pending);
                  return (
                    <TableRow
                      key={`${item.accountId}-${item.term}-${index}`}
                      className="group hover:bg-gray-50 transition-all duration-200"
                    >
                      <TableCell className="font-medium">{item.accountName}</TableCell>
                      <TableCell className="text-center">{item.term || '-'}</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.color} bg-gray-100`}>
                          {status.status === 'Overdue' && <AlertTriangle className="w-4 h-4" />}
                          {status.status === 'Due Soon' && <Clock className="w-4 h-4" />}
                          {status.status === 'Paid' && <CheckCircle2 className="w-4 h-4" />}
                          {status.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{formatDate(item.dueDate)}</TableCell>
                      <TableCell className="text-center font-medium">
                        ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center">
                        ₹{item.concession.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center">
                        ₹{item.paid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center font-medium text-blue-600">
                        ₹{item.pending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Input
                            value={item.currentPayment}
                            onChange={(e) => handleCurrentPaymentChange(index, e.target.value)}
                            className={`w-32 text-center mx-auto rounded-lg border-2 focus-visible:ring-0 focus-visible:ring-offset-0
                              ${inputErrors[index] 
                                ? 'border-red-500 focus:ring-red-200' 
                                : 'border-gray-300 group-hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200'}
                              transition-all duration-200`}
                            min="0"
                            max={item.pending}
                            //placeholder={`Max ₹${item.pending}`}
                          />
                          {inputErrors[index] && (
                            <span className="text-xs text-red-500">{inputErrors[index]}</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 font-bold">
                  <TableCell colSpan={7} className="text-right">Total</TableCell>
                  <TableCell className="text-center text-blue-600">
                    ₹{totalPending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center text-green-600">
                    ₹{totalCurrentPayment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConcessionDialog
        isOpen={isConcessionDialogOpen}
        onClose={() => setIsConcessionDialogOpen(false)}
        feeData={feeData}
        feeDetails={feeDetails}
        onSuccess={handleConcessionSuccess}
      />

     <AddFeeDialog
        isOpen={isAddFeeDialogOpen}
        onClose={() => setIsAddFeeDialogOpen(false)}
        feeData={feeData}
        onSuccess={handleAddFeeSuccess}
      />

      <PastPaymentsDialog
        isOpen={isPastPaymentsOpen}
        onClose={() => setIsPastPaymentsOpen(false)}
        payments={feeData.payments}
        feeData={feeData}
      />
    </div>
  );
}