"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SubmitButton from "@/components/ui/SubmitButton";
import { useToast } from "@/hooks/use-toast";
import styles from "@/public/assets/styles/toast.module.css";
import { ToastAction } from "@/components/ui/toast";
import { SelectItem } from "@/components/ui/select";
import { BusFront } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Branch interface
interface Branch {
  id: number; // Changed to number to match Prisma model
  label: string;
}

// Vehicle Update Form Values Interface
export interface VehicleUpdateFormValues {
  vehicleNumber: string;
  driverName: string;
  contactNumber: string;
  capacity: number;
  chassisNo: string;
  engineNo: string;
  modal: string;
  mielage: string; // Fixed typo from 'mielage'
  regNo: string;
  branchId: number;
}

// Zod Validation Schema
export const VehicleValidation = z.object({
  vehicleNumber: z.string().nonempty({ message: "Vehicle number is required" }),
  driverName: z.string().nonempty({ message: "Driver name is required" }),
  contactNumber: z.string().nonempty({ message: "Contact number is required" }),
  capacity: z.number().min(1, { message: "Capacity must be at least 1" }),
  chassisNo: z.string().nonempty({ message: "Chassis number is required" }),
  engineNo: z.string().nonempty({ message: "Engine number is required" }),
  modal: z.string().nonempty({ message: "Model is required" }),
  mielage: z.string().nonempty({ message: "Mileage is required" }),
  regNo: z.string().nonempty({ message: "Reg No. is required" }),
  branchId: z.number().int({ message: "Branch is required" }),
});

// Vehicle Update Sheet Modal Props
interface VehicleUpdateSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: number;
  initialData?: VehicleUpdateFormValues;
  onVehicleUpdated?: (
    updatedVehicleData: VehicleUpdateFormValues
  ) => Promise<void>;
}

export function VehicleUpdateSheetModal({
  isOpen,
  onClose,
  vehicleId,
  initialData,
}: VehicleUpdateSheetModalProps) {
  const methods = useForm<VehicleUpdateFormValues>({
    resolver: zodResolver(VehicleValidation),
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

  const { handleSubmit, reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Using useCallback to memoize fetchBranches to prevent unnecessary re-renders
  const fetchBranches = useCallback(async () => {
    try {
      const response = await fetch("/api/branches");
      if (!response.ok) throw new Error("Failed to fetch branches");
      const data: Branch[] = await response.json();
      setBranches(data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load branches",
        className: styles.error,
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      fetchBranches();
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, fetchBranches]);

  const handleUpdate = async (data: VehicleUpdateFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    const updatedData = {
      ...data,
      branchId: Number(data.branchId), // Convert branchId to a number
    };

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update vehicle");

      // const result = await response.json();

      toast({
        title: "Success!",
        description: "Vehicle updated successfully.",
        className: styles.success,
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update vehicle:", error);

      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem updating the vehicle.",
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

  const onSubmit: SubmitHandler<VehicleUpdateFormValues> = (updatedData) => {
    handleUpdate(updatedData);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Update Vehicle Details</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <BusFront className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Update Vehicle Details
              </h2>
            </div>
            <p className="text-sm">Edit Existing Vehicle Details</p>
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="vehicleNumber"
                  label="Vehicle Number"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="driverName"
                  label="Driver Name"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="contactNumber"
                  label="Contact Number"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="capacity"
                  label="Capacity"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="chassisNo"
                  label="Chassis Number"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="engineNo"
                  label="Engine Number"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="modal"
                  label="Model"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="mielage"
                  label="Mileage"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="regNo"
                  label="Registration No."
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name="branchId"
                  label="Branch"
                >
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.label}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <SubmitButton isLoading={isLoading}>Update</SubmitButton>
              </form>
            </FormProvider>

            {error && <div className="text-red-500">{error}</div>}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
