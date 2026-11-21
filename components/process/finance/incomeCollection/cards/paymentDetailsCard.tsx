import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import { FormProvider, useForm } from 'react-hook-form';
import { bankNameTypes, payModeTypes } from '@/constant/data';
import { SelectItem } from '@/components/ui/select';
import axios from 'axios';
import { FeeDetail, PaymentSubmission } from '@/types/income';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wallet } from 'lucide-react';

interface PaymentDetailsCardProps {
  feeDetails: FeeDetail[];
  studentFeeId: number;
  studentId: number;
  enrollmentId: number;
  academicYearId: number;
  branchId: number;
  studentDetails: {
    name: string;
    fatherName: string;
    class: string;
    section: string;
    branch: string;
    contactNo: string;
  };
  onReceiptGenerated: (data: ReceiptData) => void;
}

interface FormValues {
  collectedDate: string;
  paymentMode: string;
  bankName: string;
  reference: string;
  description: string;
}

interface PaymentResponse {
  id: number;
  accountId: number;
  term: number;
  amount: number;
  receiptNumber: string;
  accountName: string;
}

export interface ReceiptData {
  studentDetails: PaymentDetailsCardProps["studentDetails"];
  paymentDetails: FormValues;
  payments: PaymentResponse[];
}

interface ApiResponse {
  data: {
    payments: PaymentResponse[];
  };
}

export function PaymentDetailsCard({
  feeDetails,
  studentFeeId,
  studentId,
  enrollmentId,
  academicYearId,
  branchId,
  studentDetails,
  onReceiptGenerated
}: PaymentDetailsCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [payMode, setPayMode] = useState<string>('');
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  const methods = useForm<FormValues>({
    defaultValues: {
      collectedDate: today,
      paymentMode: '',
      bankName: '',
      reference: '',
      description: '',
    },
  });

  const validateForm = (formValues: FormValues): string | null => {
    if (!formValues.collectedDate) {
      return 'Collection date is required';
    }

    if (!formValues.paymentMode) {
      return 'Payment mode is required';
    }

    if (formValues.paymentMode === 'Online') {
      if (!formValues.bankName) {
        return 'Bank name is required for online payments';
      }
      if (!formValues.reference) {
        return 'UTR/Challan number is required for online payments';
      }
      if (formValues.reference.length < 3) {
        return 'Reference number must be at least 3 characters';
      }
    }

    return null;
  };

  const onSubmit = async (formValues: FormValues) => {
    // Validate form
    const validationError = validateForm(formValues);
    if (validationError) {
      toast({
        title: 'Validation Error',
        description: validationError,
        variant: 'destructive'
      });
      return;
    }

    // Validate payments
    const paymentsToSubmit = feeDetails
      .filter(detail => {
        const payment = parseFloat(detail.currentPayment || '0');
        return !isNaN(payment) && payment > 0;
      })
      .map(detail => ({
        accountId: detail.accountId,
        term: detail.term,
        amount: parseFloat(detail.currentPayment || '0')
      }));

    if (paymentsToSubmit.length === 0) {
      toast({
        title: 'No payments to submit',
        description: 'Please enter at least one payment amount',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: PaymentSubmission = {
        studentFeeId,
        studentId,
        enrollmentId,
        branchId,
        academicYearId,
        payments: paymentsToSubmit,
        paymentDetails: formValues
      };

      const response = await axios.post<ApiResponse>('/api/studentFees/submitPayment', payload);
      
      const paymentsWithAccounts = response.data.data.payments.map((payment: PaymentResponse) => {
        const feeDetail = feeDetails.find(
          detail => detail.accountId === payment.accountId && parseInt(detail.term, 10) === payment.term
        );
        return {
          ...payment,
          accountName: feeDetail?.accountName || 'Unknown Account'
        };
      });

      const receiptData: ReceiptData = {
        studentDetails,
        paymentDetails: formValues,
        payments: paymentsWithAccounts
      };

      onReceiptGenerated(receiptData);

      toast({
        title: 'Payment Successful',
        description: 'The payment has been recorded successfully',
      });

      methods.reset();
      
    } catch (error) {
      console.error('Payment submission error:', error);
      toast({
        title: 'Payment Failed',
        description: 'Failed to submit payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayModeChange = (value: string) => {
    setPayMode(value);
    // Reset bank-related fields when payment mode changes
    if (value !== 'Online') {
      methods.setValue('bankName', '');
      methods.setValue('reference', '');
    }
  };

  return (
    <Card className="w-full rounded-xl bg-white shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-800">Payment Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <section className="bg-white rounded-lg">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={methods.control}
                    name="collectedDate"
                    label="Collection Date"
                    placeholder=""
                    mandatory={true}
                  />
                </div>

                <div className="relative">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={methods.control}
                    name="description"
                    label="Payment Description"
                    placeholder="Enter payment description"
                    mandatory={false}
                  />
                </div>

                <div className="relative">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={methods.control}
                    name="paymentMode"
                    label="Payment Mode"
                    placeholder="Select payment mode"
                    mandatory={true}
                    onChange={handlePayModeChange}
                  >
                    {payModeTypes.map((type, i) => (
                      <SelectItem key={type + i} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </CustomFormField>
                </div>

                {payMode === 'Online' && (
                  <>
                    <div className="relative">
                      <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={methods.control}
                        name="bankName"
                        label="Bank Deposited"
                        placeholder="Select bank"
                        mandatory={true}
                      >
                        {bankNameTypes.map((type, i) => (
                          <SelectItem key={type + i} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </CustomFormField>
                    </div>

                    <div className="relative">
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={methods.control}
                        name="reference"
                        label="UTR / Challan Number"
                        placeholder="Enter reference number"
                        mandatory={true}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-8 py-2.5 rounded-lg
                    hover:from-blue-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200
                    focus:ring-2 focus:ring-purple-200 disabled:opacity-70 disabled:cursor-not-allowed
                    flex items-center gap-2 text-base font-medium shadow-md hover:shadow-lg"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4" />
                      Submit Payment
                    </>
                  )}
                </Button>
              </div>
            </section>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}