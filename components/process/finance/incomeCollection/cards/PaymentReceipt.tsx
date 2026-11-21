import React from "react";
import { Card } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentReceiptProps {
  studentDetails: {
    name: string;
    fatherName: string;
    class: string;
    section: string;
    branch: string;
    contactNo: string;
  };
  paymentDetails: {
    paymentMode: string;
    collectedDate: string;
    bankName?: string;
    reference?: string;
  };
  payments: Array<{
    id: number;
    accountId: number;
    amount: number;
    term: number;
    receiptNumber: string;
    accountName: string;
  }>;
}

const PaymentReceipt = ({
  studentDetails,
  paymentDetails,
  payments,
}: PaymentReceiptProps) => {
  const handlePrint = () => {
    window.print();
  };

  const totalAmount = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const Receipt = ({ copy }: { copy: string }) => (
    <div className="relative bg-white p-4">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <p className="text-black text-6xl font-bold rotate-[-45deg]">
          {copy} COPY
        </p>
      </div>

      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-gray-800">School Name</h1>
        <p className="text-xs text-gray-600 mb-1">{studentDetails.branch}</p>
        <p className="text-xs font-medium text-gray-600">{copy} Copy</p>
      </div>

      {/* Receipt Details */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-4 text-xs">
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Receipt No</span>
          <span className="text-gray-800">{payments[0]?.receiptNumber}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Date</span>
          <span className="text-gray-800">
            {new Date(paymentDetails.collectedDate).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            )}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Student Name</span>
          <span className="text-gray-800">{studentDetails.name}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Class</span>
          <span className="text-gray-800">{studentDetails.class}</span>
        </div>

        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Father&apos;s Name</span>
          <span className="text-gray-800">{studentDetails.fatherName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Section</span>
          <span className="text-gray-800">{studentDetails.section}</span>
        </div>

        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Contact</span>
          <span className="text-gray-800">{studentDetails.contactNo}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Payment Mode</span>
          <span className="text-gray-800">{paymentDetails.paymentMode}</span>
        </div>

        {paymentDetails.bankName && (
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="text-gray-600">Bank Name</span>
            <span className="text-gray-800">{paymentDetails.bankName}</span>
          </div>
        )}
        {paymentDetails.reference && (
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="text-gray-600">Reference No</span>
            <span className="text-gray-800">{paymentDetails.reference}</span>
          </div>
        )}
      </div>

      {/* Payment Details Table */}
      <table className="w-full mb-4">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-1 text-xs font-medium text-gray-600">
              Account
            </th>
            <th className="text-left py-1 text-xs font-medium text-gray-600">
              Term
            </th>
            <th className="text-right py-1 text-xs font-medium text-gray-600">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-gray-200">
              <td className="py-1 text-xs text-gray-800">
                {payment.accountName}
              </td>
              <td className="py-1 text-xs text-gray-800">
                Term {payment.term}
              </td>
              <td className="py-1 text-xs text-gray-800 text-right">
                ₹
                {payment.amount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
          <tr className="font-medium">
            <td colSpan={2} className="py-1 text-xs text-gray-800 text-right">
              Total Amount:
            </td>
            <td className="py-1 text-xs text-gray-800 text-right">
              ₹
              {totalAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mt-6">
        <div className="text-center">
          <div className="border-t border-gray-400">
            <p className="text-xs mt-1 text-gray-600">Cashier Signature</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400">
            <p className="text-xs mt-1 text-gray-600">Parent Signature</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }
        
        @media print {
          html, body {
            width: 297mm;
            height: 210mm;
            margin: 0;
            padding: 0;
          }
          
          .print-container {
            width: 297mm;
            height: 210mm;
            display: flex;
            padding: 10mm;
            box-sizing: border-box;
          }
          
          .no-print {
            display: none !important;
          }
          
          .receipt-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10mm;
            height: 100%;
          }
          
          .receipt-page {
            border: 1px solid #e2e8f0;
            height: 100%;
          }

          .card-wrapper {
            padding: 0 !important;
            background: none !important;
            box-shadow: none !important;
          }

          /* Dotted line between receipts */
          .receipt-container::after {
            content: "";
            position: absolute;
            top: 10mm;
            bottom: 10mm;
            left: 50%;
            border-left: 1px dashed #cbd5e0;
          }
        }

        /* Screen view styles */
        .receipt-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .receipt-page {
          border: 1px solid #e2e8f0;
        }
      `}</style>

      <div className="print-container">
        <Card className="w-full bg-white p-6 card-wrapper">
          <div className="flex justify-end mb-6 no-print">
            <Button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </Button>
          </div>

          <div className="receipt-container">
            <div className="receipt-page">
              <Receipt copy="Office" />
            </div>
            <div className="receipt-page">
              <Receipt copy="Parent" />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default PaymentReceipt;
