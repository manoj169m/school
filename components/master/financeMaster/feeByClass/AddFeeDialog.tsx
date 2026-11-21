'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { GenderTypes } from '@/constant/data';
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import { useToast } from "@/hooks/use-toast";
import { SelectItem } from '@/components/ui/select';
import { PlusCircle, Receipt } from 'lucide-react';
//import { ApiResponse, DuplicateFeeEntry } from '@/types/fees';

export interface FeeFormValues {
  accountId: number;
  term: number;
  incomeType: string;
  gender: string;
  admissionOnly: boolean;
  daysScholarOnly: boolean;
  dueDate: string;
  amount: number;
}

interface Account {
  id: string;
  accountName: string;
  applicableFor: string;
  accountType: string;
}

interface SelectedValues {
  classId: string | string[]; 
  sectionId: string | string[];
  branchId: string;
  academicYearId: string;
  feeCategoryId: string;
}

interface AddFeeDialogProps {
  selectedValues: SelectedValues;
  onAddFee: (data: FeeFormValues & { 
    classIds: number[];
    sectionIds: number[];
    branchId: number;
    academicYearId: number;
    feeCategoryId: number;
  }) => Promise<void>;
  onSuccess?: () => Promise<void>; // Add this callback for table refresh
}




const AddFeeDialog: React.FC<AddFeeDialogProps> = ({ selectedValues, onAddFee }) => {
  const formMethods = useForm<FeeFormValues>({
    defaultValues: {
      accountId: 0,
      term: 0,
      incomeType: '',
      gender: 'BOTH',
      admissionOnly: false,
      daysScholarOnly: false,
      dueDate: '',
      amount: 0,
    },
  });

  const { handleSubmit, reset, control } = formMethods;
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // const checkDuplicateFee = async (data: FeeFormValues) => {
  //   try {
  //     const classIds = Array.isArray(selectedValues.classId) 
  //       ? selectedValues.classId.map(Number)
  //       : [Number(selectedValues.classId)];
        
  //     const sectionIds = Array.isArray(selectedValues.sectionId)
  //       ? selectedValues.sectionId.map(Number)
  //       : [Number(selectedValues.sectionId)];

  //     const duplicates: { className: string; sectionName: string; term: number }[] = [];

  //     // Check each class-section combination
  //     for (const classId of classIds) {
  //       for (const sectionId of sectionIds) {
  //         const response = await fetch('/api/fees-by-class/check-duplicate', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({
  //             accountId: Number(data.accountId),
  //             term: Number(data.term),
  //             classId,
  //             sectionId,
  //             branchId: Number(selectedValues.branchId),
  //             academicYearId: Number(selectedValues.academicYearId),
  //             feeCategoryId: Number(selectedValues.feeCategoryId),
  //           }),
  //         });

  //         const result = await response.json();

  //         if (response.status === 409 && result.duplicate) {
  //           duplicates.push(result.details);
  //         }
  //       }
  //     }

  //     return {
  //       hasDuplicates: duplicates.length > 0,
  //       duplicates
  //     };
  //   } catch (error) {
  //     console.error('Error checking duplicates:', error);
  //     throw new Error('Failed to check for duplicate fees');
  //   }
  // };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/accounts');
        const accountData: Account[] = await response.json();
        
        // Filter accounts based on the specified conditions
        const filteredAccounts = accountData.filter(account => 
          account.applicableFor !== 'TRANSPORT' && 
          account.applicableFor !== 'HOSTEL' && 
          account.accountType === 'INCOME'
        );
        
        setAccounts(filteredAccounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch accounts. Please try again.',
          className: 'bg-red-50 border-custom-red-600',
        });
      }
    };

    fetchAccounts();
  }, [toast]);
  
  // Updates to AddFeeDialog.tsx - handleCreate function
  const handleCreate: SubmitHandler<FeeFormValues> = async (data) => {
    setValidationError(null);
    setIsLoading(true);

    try {
      const payload = {
        ...data,
        accountId: Number(data.accountId),
        term: Number(data.term),
        amount: Number(data.amount),
        classIds: Array.isArray(selectedValues.classId) 
          ? selectedValues.classId.map(Number)
          : [Number(selectedValues.classId)],
        sectionIds: Array.isArray(selectedValues.sectionId)
          ? selectedValues.sectionId.map(Number)
          : [Number(selectedValues.sectionId)],
        branchId: Number(selectedValues.branchId),
        academicYearId: Number(selectedValues.academicYearId),
        feeCategoryId: Number(selectedValues.feeCategoryId),
      };

      // Call the onAddFee callback which will handle the API call
      await onAddFee(payload);
      
      // Close dialog and reset form on success
      setIsOpen(false);
      reset();

      toast({
        title: 'Success',
        description: 'Fee details have been successfully added.',
        className: 'bg-custom-sandle-100 border-custom-pink-300',
      });

    } catch (error) {
      console.error('Error adding fee details:', error);
      
      // Handle duplicate fees error
      if (error instanceof Error && error.message === 'Duplicate fee entries found') {
        setValidationError('Duplicate fee entries found. Please check the existing fees.');
      } else {
        setValidationError(error instanceof Error ? error.message : 'Failed to add fee details');
      }
      
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-custom-pink-300 hover:bg-custom-pink-400 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Fee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 rounded-xl shadow-2xl bg-white">
        {/* Dialog header */}
        <div className="bg-gradient-to-r from-custom-pink-300 to-custom-pink-300 p-6 rounded-t-xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Receipt className="w-8 h-8 text-white" />
              <DialogTitle className="text-2xl font-semibold text-white">Add Fee Details</DialogTitle>
            </div>
            <DialogDescription className="text-custom-sandle-100">
              Enter the fee details for selected class and section
            </DialogDescription>
          </DialogHeader>
        
        {validationError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{validationError}</p>
            </div>
          )}
          </div>
        {/* Form content */}
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(handleCreate)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {/* Left Column */}
              
              <div className="space-y-6">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name="accountId"
                  label="Select Account"
                  mandatory={true}
                >
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.accountName}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField 
                  fieldType={FormFieldType.NUMBER} 
                  control={control} 
                  name="term" 
                  label="Term Number"
                  mandatory={true}
                />

                <CustomFormField 
                  fieldType={FormFieldType.NUMBER} 
                  control={control} 
                  name="amount" 
                  label="Fee Amount (₹)"
                  mandatory={true}
                />
              </div>

              {/* Middle Column */}
              <div className="space-y-6">
                <CustomFormField 
                  fieldType={FormFieldType.INPUT} 
                  control={control} 
                  name="incomeType" 
                  label="Income Type"
                  mandatory={true}
                />
                
                <CustomFormField 
                  fieldType={FormFieldType.DATE_PICKER} 
                  control={control} 
                  name="dueDate" 
                  label="Due Date"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.RADIO}
                  control={control}
                  name="gender"
                  label="Applicable Gender"
                  options={GenderTypes}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="p-5 bg-custom-sandle-100 rounded-lg border border-custom-pink-100">
                  <h3 className="text-custom-pink-400 font-medium mb-4">Fee Type Settings</h3>
                  <div className="space-y-4">
                    <CustomFormField 
                      fieldType={FormFieldType.CHECKBOX} 
                      control={control} 
                      name="admissionOnly" 
                      label="Admission Fee Only"
                    />
                    <CustomFormField 
                      fieldType={FormFieldType.CHECKBOX} 
                      control={control} 
                      name="daysScholarOnly" 
                      label="Day Scholar Only"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="px-6 border-custom-pink-300 text-custom-pink-300 hover:bg-custom-pink-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-custom-pink-300 hover:bg-custom-pink-400 text-white px-8"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Processing...
                  </span>
                ) : (
                  'Add Fee'
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeeDialog;