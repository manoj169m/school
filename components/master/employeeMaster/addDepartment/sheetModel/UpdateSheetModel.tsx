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
import { ToastAction } from "@/components/ui/toast";
import { Shapes } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


interface DepartmentUpdateSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId?: number; // Optional ID for the existing department
  initialData?: DepartmentUpdateFormValues;
  onDepartmentUpdated?: (
    updatedDepartmentData: DepartmentUpdateFormValues
  ) => Promise<void>;
}

export interface DepartmentUpdateFormValues {
  name: string;
}

export const DepartmentValidation = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
});

export function DepartmentUpdateSheetModal({
  isOpen,
  onClose,
  departmentId,
  initialData,
}: DepartmentUpdateSheetModalProps) {
  const methods = useForm<DepartmentUpdateFormValues>({
    resolver: zodResolver(DepartmentValidation),
    defaultValues: initialData || {
      name: "",
    },
  });

  const { handleSubmit, reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Update form values when initial data changes
    if (initialData) {
      reset(initialData);
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

  const handleUpdate = async (data: DepartmentUpdateFormValues) => {
    // Ensure we have a department ID to update
    if (!departmentId) {
      toast({
        variant: "destructive",
        title: "😥 Error",
        description: "No department ID provided for update.",
        className: styles.error,
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Send the PUT request to update the department
      const response = await fetch(`/api/department/${departmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Handle unsuccessful response
      if (!response.ok) throw new Error("Failed to update department");

      const result = await response.json();
      console.log(result);

      // Show success toast
      toast({
        title: "🙂 Success!",
        description: "Department updated successfully.",
        className: styles.success,
      });

      // Reset the form and close the modal after success
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update department:", error);

      // Show error toast with retry action
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem updating the department.",
        className: styles.error,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => handleUpdate(data)} // Retry logic: attempt to update department again
          >
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<DepartmentUpdateFormValues> = (data) => {
    handleUpdate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md">
        {/* Accessible Dialog Title */}
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Update Department</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Shapes className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Update Department
              </h2>
            </div>
            <p className="text-sm">Edit Existing Department</p>
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
                  name="name"
                  label="Name"
                />
                <SubmitButton isLoading={isLoading}>
                  Update Department
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
