import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "@/components/ui/SubmitButton";
import { useToast } from "@/hooks/use-toast";
import styles from "@/public/assets/styles/toast.module.css";
import { ToastAction } from "@/components/ui/toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Receipt } from "lucide-react";
import { FeeByHotelValidation, FeeByHostelInput } from "@/lib/validation/TableValidations";
import { SelectItem } from "@/components/ui/select";

type AcademicYearOption = {
  id: number;
  label: string;
};

type Hostel = {
  id: string;
  hostelName: string;
};

type Account = {
  id: string;
  accountName: string;
  applicableFor: string;
  accountType: string;
};

interface UpdateFeeByHostelSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    id: number;
    academicYearId: number;
    hostelId: number;
    accountId: number;
    term: number;
    feeAmount: number;
  };
  onFeeByHostelUpdated?: () => Promise<void>;
}

export function UpdateFeeByHostelSheetModal({
  isOpen,
  onClose,
  initialData,
  onFeeByHostelUpdated
}: UpdateFeeByHostelSheetModalProps) {
  const methods = useForm<FeeByHostelInput>({
    resolver: zodResolver(FeeByHotelValidation),
    defaultValues: {
      academicYearId: undefined,
      hostelId: undefined,
      accountId: undefined,
      term: undefined,
      feeAmount: initialData?.feeAmount,
    },
  });

  const { handleSubmit, reset, control, setError } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Watch the feeAmount field for validation

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [yearResponse, hostelResponse, accountResponse] = await Promise.all([
          fetch("/api/academicYears"),
          fetch("/api/hostels"),
          fetch("/api/accounts")
        ]);

        if (!yearResponse.ok || !hostelResponse.ok || !accountResponse.ok) {
          throw new Error("Failed to fetch initial data");
        }

        const years = await yearResponse.json();
        const hostelData = await hostelResponse.json();
        const accountData: Account[] = await accountResponse.json();

        const filteredAccounts = accountData.filter(
          (account) => account.applicableFor === "HOSTEL" && account.accountType === "INCOME"
        );

        setAcademicYears(years);
        setHostels(hostelData);
        setAccounts(filteredAccounts);
      } catch (error) {
        toast({
          title: "🚨 Network Error",
          description: "Error fetching initial data",
          variant: "destructive",
        });
        console.log(error);
        
      }
    };

    if (isOpen) {
      fetchInitialData();
      // Reset form with initial data when modal opens
      reset({
        academicYearId: undefined,
        hostelId: undefined,
        accountId: undefined,
        term: undefined,
        feeAmount: initialData.feeAmount,
      });
    }
  }, [isOpen, initialData, reset, toast]);

  const handleUpdate = async (data: FeeByHostelInput) => {
    // Validate that new amount is not less than initial amount
    if (Number(data.feeAmount) < initialData.feeAmount) {
      setError("feeAmount", {
        type: "manual",
        message: "Fee amount cannot be decreased from the initial amount"
      });
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Fee amount cannot be decreased from the initial amount",
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        id: initialData.id,
        hostelId: Number(data.hostelId),
        academicYearId: Number(data.academicYearId),
        accountId: Number(data.accountId),
        feeAmount: Number(data.feeAmount),
        term: Number(data.term)
      };

      const response = await fetch(`/api/fee-by-hostel/${initialData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update fee record');
      }

      toast({
        title: "🙂 Success!",
        description: "Fee record updated successfully.",
        className: styles.success,
      });

      if (onFeeByHostelUpdated) {
        await onFeeByHostelUpdated();
      }

      onClose();
    } catch (error) {
      console.error("Failed to update fee record:", error);
      
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: error instanceof Error ? error.message : "There was a problem updating the fee record.",
        className: styles.error,
        action: (
          <ToastAction altText="Try again" onClick={() => handleUpdate(data)}>
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Update Fee</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Update Fee
              </h2>
            </div>
            <p className="text-sm">Update Fee Record</p>
          </div>
        </SheetHeader>

        <div className="mt-6 mb-6">
          <hr className="flex-grow border-red-600" />
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name="academicYearId"
                  label="Academic Year"
                  placeholder="Select Academic Year"
                  mandatory={true}
                  disabled={true} // Prevent changing academic year
                >
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.label}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name="hostelId"
                  label="Hostel Name"
                  placeholder="Select Hostel"
                  mandatory={true}
                  disabled={true} // Prevent changing hostel
                >
                  {hostels.map((hostel) => (
                    <SelectItem key={hostel.id} value={hostel.id.toString()}>
                      {hostel.hostelName}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name="accountId"
                  label="Account Name"
                  placeholder="Select Account"
                  mandatory={true}
                  disabled={true} // Prevent changing account
                >
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.accountName}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name="term"
                  label="Term"
                  placeholder="Select Term"
                  mandatory={true}
                  disabled={true} // Prevent changing term
                >
                  {[1, 2, 3].map((term) => (
                    <SelectItem key={term} value={term.toString()}>
                      {`Term ${term}`}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="feeAmount"
                  label="Amount"
                  placeholder="Enter the amount"
                  mandatory={true}
                />

                <SubmitButton isLoading={isLoading}>
                  Update Fee Record
                </SubmitButton>
              </form>
            </FormProvider>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}