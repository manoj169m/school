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
import { BusFront } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
interface VehicleViewSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: number;
  initialData?: VehicleViewFormValues;
}

export interface VehicleViewFormValues {
  vehicleNumber: string;
  driverName?: string;
  contactNumber?: string;
  capacity: number;
  chassisNo: string;
  engineNo: string;
  modal: string;
  mielage: string;
  regNo: string;
  branchId: number;
}

export const VehicleViewValidation = z.object({
  vehicleNumber: z.string().nonempty({ message: "Vehicle number is required" }),
  driverName: z.string().optional(),
  contactNumber: z.string().optional(),
  capacity: z
    .number()
    .nonnegative({ message: "Capacity must be a non-negative number" }),
  chassisNo: z.string().nonempty({ message: "Chassis number is required" }),
  engineNo: z.string().nonempty({ message: "Engine number is required" }),
  modal: z.string().nonempty({ message: "Model is required" }),
  mielage: z.string().nonempty({ message: "Mileage is required" }),
  regNo: z.string().nonempty({ message: "Mileage is required" }),
  branchId: z
    .string()
    .nonempty({ message: "Branch is required" })
    .transform((value) => Number(value)),
});

export function VehicleViewSheetModal({
  isOpen,
  onClose,
  initialData,
}: VehicleViewSheetModalProps) {
  const methods = useForm<VehicleViewFormValues>({
    resolver: zodResolver(VehicleViewValidation),
    defaultValues: initialData || {
      vehicleNumber: "",
      driverName: "",
      contactNumber: "",
      capacity: 0,
      chassisNo: "",
      engineNo: "",
      modal: "",
      mielage: "",
      regNo:"",
      branchId: 0,
    },
  });

  const { reset, control } = methods;
  const [error, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log(setErrorMessage);

  useEffect(() => {
    // Simulating data loading with a delay
    setIsLoading(true);
    if (initialData) {
      reset(initialData);
      setIsLoading(false); // Set loading to false when data is reset
    }
  }, [initialData, reset]);

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
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Vehicle Details</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <BusFront className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Vehicle Details
              </h2>
            </div>
            <p className="text-sm">View Vehicle Information</p>
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
                  name="vehicleNumber"
                  label="Vehicle Number"
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="driverName"
                  label="Driver Name"
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="contactNumber"
                  label="Contact Number"
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
                  name="chassisNo"
                  label="Chassis Number"
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="engineNo"
                  label="Engine Number"
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="modal"
                  label="Model"
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="mielage"
                  label="Mileage"
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="regNo"
                  label="Registration No."
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name="branchId"
                  label="Branch"
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
            {error && <div className="text-red-500">{error}</div>}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
