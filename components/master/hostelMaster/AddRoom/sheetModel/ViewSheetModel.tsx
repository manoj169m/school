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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Building } from "lucide-react";
import { HostelValidation } from "@/lib/validation/TableValidations";

type HostelInput = z.infer<typeof HostelValidation>;

interface HostelViewSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostelId?: number;
  initialData?: HostelInput;
}

export function HostelViewSheetModal({
  isOpen,
  onClose,
  initialData,
}: HostelViewSheetModalProps) {
  const methods = useForm<HostelInput>({
    resolver: zodResolver(HostelValidation),
    defaultValues: initialData || {
      hostelName: "",
      capacity: 0,
      type: "",
      floorCount: 0,
    },
  });

  const { reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);
  console.log(setIsLoading);

  useEffect(() => {
    // Update form values when initial data changes
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Effect to manage modal open/close body class
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
            <VisuallyHidden>Hostel Details</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Hostel Details
              </h2>
            </div>
            <p className="text-sm">View Hostel Information</p>
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
                  name="hostelName"
                  label="Hostel Name"
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="capacity"
                  label="Capacity"
                  disabled
                />
                 <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="floorCount"
                  label="Floor Count"
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="type"
                  label="Type"
                  disabled
                />
                <Button
                  onClick={onClose}
                  className="w-full mt-4 bg-custom-pink-300 text-white hover:bg-custom-pink-200 hover:text-white"
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
