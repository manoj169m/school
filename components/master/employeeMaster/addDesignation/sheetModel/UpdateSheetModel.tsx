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
import { BriefcaseBusiness } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface DesignationUpdateSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  designationId?: number; // Optional ID for the existing designation
  initialData?: DesignationUpdateFormValues;
  onDesignationUpdated?: (
    updatedDesignationData: DesignationUpdateFormValues
  ) => Promise<void>;
}

export interface DesignationUpdateFormValues {
  title: string;
}

export const DesignationValidation = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
});

export function DesignationUpdateSheetModal({
  isOpen,
  onClose,
  designationId,
  initialData,
}: DesignationUpdateSheetModalProps) {
  const methods = useForm<DesignationUpdateFormValues>({
    resolver: zodResolver(DesignationValidation),
    defaultValues: initialData || {
      title: "",
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
    // Add the modal-open class to the body on open, remove on close
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleUpdate = async (data: DesignationUpdateFormValues) => {
    // Ensure we have a designation ID to update
    if (!designationId) {
      toast({
        variant: "destructive",
        title: "😥 Error",
        description: "No designation ID provided for update.",
        className: styles.error,
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Send the PUT request to update the designation
      const response = await fetch(`/api/designation/${designationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Handle unsuccessful response
      if (!response.ok) throw new Error("Failed to update designation");

      const result = await response.json();
      console.log(result);

      // Show success toast
      toast({
        title: "🙂 Success!",
        description: "Designation updated successfully.",
        className: styles.success,
      });

      // Reset the form and close the modal after success
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update designation:", error);

      // Show error toast with retry action
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem updating the designation.",
        className: styles.error,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => handleUpdate(data)} // Retry logic: attempt to update designation again
          >
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<DesignationUpdateFormValues> = (data) => {
    handleUpdate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md">
        {/* Accessible Dialog Title */}
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Update Designation</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <BriefcaseBusiness className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Update Designation
              </h2>
            </div>
            <p className="text-sm">Edit Existing Designation</p>
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
                  name="title"
                  label="Title"
                />
                <SubmitButton isLoading={isLoading}>
                  Update Designation
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
