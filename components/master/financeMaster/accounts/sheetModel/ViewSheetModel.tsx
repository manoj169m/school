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
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AccountValidation } from "@/lib/validation/TableValidations";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { UserPen } from "lucide-react";

export type AccountInput = z.infer<typeof AccountValidation>;

interface AccountViewSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId?: number;
  initialData?: AccountInput;
}

export function AccountViewSheetModal({
  isOpen,
  onClose,
  initialData,
}: AccountViewSheetModalProps) {
  const methods = useForm<AccountInput>({
    resolver: zodResolver(AccountValidation),
    defaultValues: initialData || {
      accountName: "",
      accountType: "ASSET",
      description: "",
      openingBalance: 0,
      applicableFor: "NONE",
    },
  });

  const { reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);
  console.log(setIsLoading);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Account Details</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <UserPen className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Account Details
              </h2>
            </div>
            <p className="text-sm">View Account Information</p>
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
              <div className="space-y-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="accountName"
                  label="Account Name"
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="accountType"
                  label="Account Type"
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={control}
                  name="description"
                  label="Description"
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="applicableFor"
                  label="Applicable For"
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={control}
                  name="openingBalance"
                  label="Opening Balance"
                  disabled
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
        )}
      </SheetContent>
    </Sheet>
  );
}
