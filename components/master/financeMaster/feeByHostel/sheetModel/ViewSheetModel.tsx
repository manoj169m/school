"use client";

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
import { Button } from "@/components/ui/button";
import { FeeByHotelValidation, FeeByHostelInput } from "@/lib/validation/TableValidations";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Receipt } from "lucide-react";
import { SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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

interface FeeByHostelViewSheetModalProps {
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
}

export function FeeByHostelViewSheetModal({
  isOpen,
  onClose,
  initialData,
}: FeeByHostelViewSheetModalProps) {
  const methods = useForm<FeeByHostelInput>({
    resolver: zodResolver(FeeByHotelValidation),
    defaultValues: {
      academicYearId: initialData?.academicYearId,
      hostelId: initialData?.hostelId,
      accountId: initialData?.accountId,
      term: initialData?.term,
      feeAmount: initialData?.feeAmount,
    },
  });

  const { control } = methods;
  const { toast } = useToast();
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

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
    }
  }, [isOpen, toast]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>View Fee</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                View Fee
              </h2>
            </div>
            <p className="text-sm">View Fee Record</p>
          </div>
        </SheetHeader>

        <div className="mt-6 mb-6">
          <hr className="flex-grow border-red-600" />
        </div>

        <div>
          <FormProvider {...methods}>
            <div className="space-y-4">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={control}
                name="academicYearId"
                label="Academic Year"
                placeholder="Select Academic Year"
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
              />

              <Button
                onClick={onClose}
                className="w-full mt-4 bg-custom-pink-300 text-white hover:bg-custom-red-600 hover:text-white"
                variant="outline"
              >
                Close
              </Button>
            </div>
          </FormProvider>
        </div>
      </SheetContent>
    </Sheet>
  );
}