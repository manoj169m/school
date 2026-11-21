import React, { useEffect, useState } from "react";
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
import { SelectItem } from "@/components/ui/select";
import { BusFront } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface VehicleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleCreated?: (
    newVehicleData: VehicleCreationFormValues
  ) => Promise<void>;
}

interface Branch {
  id: string;
  label: string;
}

export interface VehicleCreationFormValues {
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

export const VehicleValidation = z.object({
  vehicleNumber: z.string().nonempty({ message: "Vehicle number is required" }),
  driverName: z.string().optional(),
  contactNumber: z.string().optional(),
  capacity: z
    .string()
    .nonempty({ message: "Capacity is required" })
    .transform((value) => Number(value)),
  chassisNo: z.string().nonempty({ message: "Chassis number is required" }),
  engineNo: z.string().nonempty({ message: "Engine number is required" }),
  modal: z.string().nonempty({ message: "Model is required" }),
  mielage: z.string().nonempty({ message: "Mileage is required" }),
  regNo: z.string().nonempty({ message: "Reg No. is required" }),
  branchId: z
    .string()
    .nonempty({ message: "Branch is required" })
    .transform((value) => Number(value)),
});

export function SheetModal({ isOpen, onClose }: VehicleSheetModalProps) {
  const methods = useForm<VehicleCreationFormValues>({
    resolver: zodResolver(VehicleValidation),
    defaultValues: {
      vehicleNumber: "",
      driverName: "",
      contactNumber: "",
      capacity: 0,
      chassisNo: "",
      engineNo: "",
      modal: "",
      mielage: "",
      regNo: "",
      branchId: undefined,
    },
  });

  const { handleSubmit, reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const { toast } = useToast();

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
  }, [isOpen]);

  const fetchBranches = async () => {
    try {
      const response = await fetch("/api/branches");
      if (!response.ok) throw new Error("Failed to fetch branches");
      const data: Branch[] = await response.json();
      setBranches(data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const handleCreate = async (data: VehicleCreationFormValues) => {
    const payload = {
      ...data,
      capacity: Number(data.capacity),
      branchId: Number(data.branchId),
    };

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create vehicle");
      }

      toast({
        title: "🙂 Success!",
        description: "Vehicle created successfully.",
        className: styles.success,
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create vehicle:", error);
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem creating the vehicle.",
        className: styles.error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<VehicleCreationFormValues> = (data) => {
    handleCreate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Add Vehicle</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <BusFront className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Add Vehicle
              </h2>
            </div>
            <p className="text-sm">Provide a valid vehicle details</p>
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

                <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
              </form>
            </FormProvider>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
