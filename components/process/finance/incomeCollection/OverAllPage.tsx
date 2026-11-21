import React, { useState, useCallback } from "react";
import { FeeDetailsTable } from "./table/table";
import { StudentProfileCard } from "./cards/studentDetailsCard";
import { PaymentDetailsCard } from "./cards/paymentDetailsCard";
import { FeeData, FeeDetail } from "@/types/income";
import PaymentReceipt from "./cards/PaymentReceipt";
import axios from "axios";
import Loading from "@/app/loading";

interface OverAllPageProps {
  feeData: FeeData;
}

interface ReceiptData {
  studentDetails: {
    name: string;
    fatherName: string;
    class: string;
    section: string;
    branch: string;
    contactNo: string;
  };
  paymentDetails: {
    collectedDate: string;
    paymentMode: string;
    bankName: string;
    reference: string;
  };
  payments: Array<{
    id: number;
    accountId: number;
    term: number;
    amount: number;
    receiptNumber: string;
    accountName: string;
  }>;
}

function OverAllPage({ feeData: initialFeeData }: OverAllPageProps) {
  const [feeData, setFeeData] = useState<FeeData>(initialFeeData);
  const [sharedFeeDetails, setSharedFeeDetails] = useState<FeeDetail[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshFeeData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get<FeeData>(`/api/studentFees/${feeData.enrollmentId}`);
      setFeeData(response.data);
    } catch (error) {
      console.error('Error refreshing fee data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [feeData.enrollmentId]);

  const handleFeeDetailsChange = (newFeeDetails: FeeDetail[]) => {
    setSharedFeeDetails(newFeeDetails);
  };

  const handleReceiptData = (data: ReceiptData) => {
    setReceiptData(data);
    setShowReceipt(true);
  };

  const handleBackToForm = async () => {
    setShowReceipt(false);
    setReceiptData(null);
    await refreshFeeData();
  };

  const handleSuccess = async () => {
    await refreshFeeData();
  };

  if (showReceipt && receiptData) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <div className="h-full">
          <div className="flex justify-between items-center p-4 bg-gray-50 print:hidden">
            <h2 className="text-lg font-semibold">Payment Receipt</h2>
            <button
              onClick={handleBackToForm}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Back to Form
            </button>
          </div>
          <div className="h-[calc(100%-4rem)]">
            <PaymentReceipt {...receiptData} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4">
        <div>
          <StudentProfileCard
            studentDetails={feeData.studentDetails}
            feeData={feeData}
          />
        </div>

        <div className="mt-6">
          <FeeDetailsTable
            feeData={feeData}
            feeDetails={sharedFeeDetails}
            onFeeDetailsChange={handleFeeDetailsChange}
            onSuccess={handleSuccess}
            isRefreshing={isRefreshing}
          />
        </div>

        <div className="mt-6">
          <PaymentDetailsCard
            feeDetails={sharedFeeDetails}
            studentFeeId={feeData.studentFeeId}
            studentId={feeData.studentId}
            enrollmentId={feeData.enrollmentId}
            branchId={feeData.branchId}
            academicYearId={feeData.academicYearId}
            studentDetails={feeData.studentDetails}
            onReceiptGenerated={handleReceiptData}
          />
        </div>
      </div>
      {isRefreshing && <Loading />}
    </>
  );
}

export default OverAllPage;