import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import { Receipt, Loader2, User, Calendar, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { FeeData } from "@/types/income";
import { toast } from "@/hooks/use-toast";

interface Account {
  id: number;
  accountName: string;
}

interface AddFeeFormValues {
  accountId: string;
  term: string;
  amount: string;
  description?: string;
  dueDate: string;
}

interface AddFeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  feeData: FeeData;
  onSuccess?: () => void;
}

export function AddFeeDialog({
  isOpen,
  onClose,
  feeData,
  onSuccess
}: AddFeeDialogProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const form = useForm<AddFeeFormValues>({
    defaultValues: {
      accountId: "",
      term: "",
      amount: "",
      description: "",
      dueDate: "",
    },
    mode: "onChange"
  });

  const { watch } = form;
  const selectedAccountId = watch("accountId");
  const selectedTerm = watch("term");

  // Check for duplicate fees whenever account or term changes
  useEffect(() => {
    if (selectedAccountId && selectedTerm) {
      const accountIdNum = parseInt(selectedAccountId);
      const termNum = parseInt(selectedTerm);
      
      // Check regular fees
      const hasRegularFee = feeData.regularFees?.some(
        fee => fee.accountId === accountIdNum && parseInt(fee.term) === termNum
      );

      // Check individual fees
      const hasIndividualFee = feeData.individualFees?.some(
        fee => fee.accountId === accountIdNum && parseInt(fee.term) === termNum
      );

      // Check transport fee
      const hasTransportFee = feeData.transportFee && 
        feeData.transportFee.accountId === accountIdNum && 
        parseInt(feeData.transportFee.term) === termNum;

      // Check hostel fee
      const hasHostelFee = feeData.hostelFee && 
        feeData.hostelFee.accountId === accountIdNum && 
        parseInt(feeData.hostelFee.term) === termNum;

      if (hasRegularFee || hasIndividualFee || hasTransportFee || hasHostelFee) {
        setDuplicateError("A fee for this account and term already exists");
      } else {
        setDuplicateError(null);
      }
    }
  }, [selectedAccountId, selectedTerm, feeData]);

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoadingAccounts(true);
      setAccountsError(null);
      
      try {
        const response = await fetch('/api/accounts');
        if (!response.ok) throw new Error('Failed to fetch accounts');
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        setAccountsError(error instanceof Error ? error.message : 'Failed to fetch accounts');
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    if (isOpen) fetchAccounts();
  }, [isOpen]);

  const onSubmit = async (values: AddFeeFormValues) => {
    if (duplicateError) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: duplicateError,
        className: 'bg-red-50 border-red-600',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const individualFeeData = {
        studentFeeId: feeData.studentFeeId,
        academicYearId: feeData.academicYearId,
        branchId: feeData.branchId,
        classId: feeData.classId,
        sectionId: feeData.sectionId,
        accountId: parseInt(values.accountId),
        term: parseInt(values.term),
        customAmount: parseFloat(values.amount),
        description: values.description || null,
      };

      const response = await fetch('/api/individual-fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(individualFeeData),
      });

      if (!response.ok) throw new Error('Failed to submit fee');
      
      toast({
        title: "Success",
        description: "Fee has been added successfully",
        className: "bg-green-50 border-green-600",
      });
      
      onSuccess?.();
      onClose();
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add fee. Please try again.',
        className: 'bg-red-50 border-red-600',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-xl shadow-xl bg-white">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-8">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-3xl font-bold text-white">
                Add Individual Fee
              </DialogTitle>
            </div>
          </DialogHeader>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-700">Academic Year</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">2024-2025</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-700">Student Name</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {feeData.studentDetails?.name || "N/A"}
                </p>
              </div>
            </div>

            {accountsError && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">
                  {accountsError}
                </AlertDescription>
              </Alert>
            )}

            {duplicateError && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-red-800">
                  {duplicateError}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="accountId"
                  label="Account Name"
                  placeholder="Select Fee Head"
                  mandatory={true}
                  disabled={isLoadingAccounts}
                >
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.accountName}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={form.control}
                  name="amount"
                  label="Amount"
                  placeholder="Enter Amount"
                  mandatory={true}
                />
              </div>

              <div className="space-y-6">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="term"
                  label="Term"
                  placeholder="Select Term"
                  mandatory={true}
                >
                  <SelectItem value="1">Term 1</SelectItem>
                  <SelectItem value="2">Term 2</SelectItem>
                  <SelectItem value="3">Term 3</SelectItem>
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="description"
                  label="Description"
                  placeholder="Enter Description"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-8 py-2.5 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="px-8 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium"
                disabled={isSubmitting || isLoadingAccounts || !!duplicateError}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Submit Fee'
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}