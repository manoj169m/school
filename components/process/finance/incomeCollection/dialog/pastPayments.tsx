import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Receipt, Users, Search, Calendar, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaymentReceipt from "../cards/PaymentReceipt";
import { FeeData } from "@/types/income";

// Interfaces remain the same
interface PaymentDetail {
  amount: number;
  collectedDate: string;
  receiptNumber: string;
  paymentMode?: string;
  bankName?: string;
  reference?: string;
}

interface Payment {
  accountId: number;
  amount: number;
  term: string;
  account: {
    accountName: string;
  };
  paymentDetails?: PaymentDetail[];
}

interface GroupedPaymentItem {
  id: number;
  accountId: number;
  accountName: string;
  term: number;
  amount: number;
  receiptNumber: string;
}

interface GroupedPayment {
  mainReceiptNumber: string;
  date: string;
  totalAmount: number;
  paymentMode?: string;
  bankName?: string;
  reference?: string;
  items: GroupedPaymentItem[];
}

interface PastPaymentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payments?: Payment[];
  feeData: FeeData;
}

export function PastPaymentsDialog({
  isOpen,
  onClose,
  payments = [],
  feeData,
}: PastPaymentsDialogProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<GroupedPayment | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Existing groupPayments function remains the same
  const groupPayments = (payments: Payment[]): GroupedPayment[] => {
    const groups: { [key: string]: GroupedPayment } = {};
    payments.forEach(payment => {
      payment.paymentDetails?.forEach(detail => {
        const baseReceiptNumber = detail.receiptNumber.split('-')[0];
        if (!groups[baseReceiptNumber]) {
          groups[baseReceiptNumber] = {
            mainReceiptNumber: baseReceiptNumber,
            date: detail.collectedDate,
            totalAmount: 0,
            paymentMode: detail.paymentMode,
            bankName: detail.bankName,
            reference: detail.reference,
            items: []
          };
        }
        groups[baseReceiptNumber].items.push({
          id: payment.accountId,
          accountId: payment.accountId,
          accountName: payment.account.accountName,
          term: parseInt(payment.term, 10),
          amount: detail.amount,
          receiptNumber: detail.receiptNumber
        });
        groups[baseReceiptNumber].totalAmount += detail.amount;
      });
    });
    return Object.values(groups);
  };

  const handleViewReceipt = (group: GroupedPayment) => {
    setSelectedReceipt(group);
    setIsReceiptModalOpen(true);
  };

  const groupedPayments = groupPayments(payments);
  const filteredGroups = groupedPayments.filter(group =>
    group.items.some(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  );

  const totalAmount = filteredGroups.reduce((sum, group) => sum + group.totalAmount, 0);
  const totalTransactions = filteredGroups.length;
  const averageAmount = totalTransactions ? totalAmount / totalTransactions : 0;

  const toggleGroup = (receiptNumber: string) => {
    setExpandedGroups(prev =>
      prev.includes(receiptNumber)
        ? prev.filter(r => r !== receiptNumber)
        : [...prev, receiptNumber]
    );
  };

  const formatPaymentsForReceipt = (items: GroupedPaymentItem[]) => {
    return items.map(item => ({
      ...item,
      term: Number(item.term)
    }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl p-0 rounded-xl overflow-hidden flex flex-col max-h-[90vh] bg-gradient-to-b from-gray-50 to-white">
          {/* Modern Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-8">
            <DialogHeader>
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                  <Receipt className="w-7 h-7 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-bold text-white">
                    Payment History
                  </DialogTitle>
                  <DialogDescription className="text-indigo-100 flex items-center gap-2 mt-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">{feeData?.studentDetails?.name || 'All Transactions'}</span>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Modern Stats Cards */}
          <div className="p-8 grid grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 rounded-xl hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600">₹{totalAmount.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">All time payments</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 rounded-xl hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600">{totalTransactions}</div>
                <div className="text-xs text-gray-500 mt-1">Total receipts</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 rounded-xl hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Average Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600">₹{averageAmount.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Per transaction</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Content Area */}
          <div className="flex-1 overflow-y-auto px-8">
            <div className="space-y-6">
              {/* Modern Search Bar */}
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  className="gap-2 rounded-xl border-gray-200 hover:border-indigo-600 hover:text-indigo-600 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  {feeData?.studentDetails?.academicYear || "All Years"}
                </Button>
                <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10 rounded-xl border-gray-200 focus:border-indigo-600 focus:ring-indigo-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Modern Payments List */}
              <div className="space-y-4 pb-6">
                {filteredGroups.map((group) => (
                  <Card 
                    key={group.mainReceiptNumber} 
                    className="border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300"
                  >
                    <div
                      className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl"
                      onClick={() => toggleGroup(group.mainReceiptNumber)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <Receipt className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Receipt: {group.mainReceiptNumber}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {new Date(group.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ₹{group.totalAmount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewReceipt(group);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          View Receipt
                        </Button>
                        <div className="w-6">
                          {expandedGroups.includes(group.mainReceiptNumber) ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {expandedGroups.includes(group.mainReceiptNumber) && (
                      <div className="border-t border-gray-100">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-gray-50">
                              <TableHead className="w-1/3">Account</TableHead>
                              <TableHead>Term</TableHead>
                              <TableHead>Receipt No</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.items.map((item, index) => (
                              <TableRow 
                                key={index}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <TableCell className="font-medium">{item.accountName}</TableCell>
                                <TableCell>Term {item.term.toString()}</TableCell>
                                <TableCell>{item.receiptNumber}</TableCell>
                                <TableCell className="text-right font-medium">
                                  ₹{item.amount.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Modern Footer */}
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={isReceiptModalOpen} onOpenChange={setIsReceiptModalOpen}>
        <DialogContent className="max-w-6xl rounded-xl">
          {selectedReceipt && (
            <PaymentReceipt
              studentDetails={feeData.studentDetails}
              paymentDetails={{
                paymentMode: selectedReceipt.paymentMode || "Cash",
                collectedDate: selectedReceipt.date,
                bankName: selectedReceipt.bankName,
                reference: selectedReceipt.reference,
              }}
              payments={formatPaymentsForReceipt(selectedReceipt.items)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}