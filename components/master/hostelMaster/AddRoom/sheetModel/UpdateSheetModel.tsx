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
import { HostelValidation } from "@/lib/validation/TableValidations";
import { Home } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type HostelInput = z.infer<typeof HostelValidation>;

interface HostelUpdateSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostelId?: number; // Optional ID for existing hostel
  initialData?: HostelInput;
  onHostelUpdated?: (updatedHostelData: HostelInput) => Promise<void>;
}

export function HostelUpdateSheetModal({
  isOpen,
  onClose,
  hostelId,
  initialData,
}: HostelUpdateSheetModalProps) {
  const methods = useForm<HostelInput>({
    resolver: zodResolver(HostelValidation),
    defaultValues: initialData || {
      hostelName: "",
      capacity: 0,
      type: "",
      floorCount: 0,
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

  const handleUpdate = async (data: HostelInput) => {
    // Ensure we have a hostel ID to update
    if (!hostelId) {
      toast({
        variant: "destructive",
        title: "😥 Error",
        description: "No hostel ID provided for update.",
        className: styles.error,
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Send the PUT request to update the hostel
      const response = await fetch(`/api/hostel/${hostelId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Handle unsuccessful response
      if (!response.ok) throw new Error("Failed to update hostel");

      const result = await response.json();
      console.log(result);
      

      // Show success toast
      toast({
        title: "🙂 Success!",
        description: "Hostel updated successfully.",
        className: styles.success,
      });

      // Reset the form and close the modal after success
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update hostel:", error);

      // Show error toast with retry action
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem updating the hostel.",
        className: styles.error,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => handleUpdate(data)} // Retry logic: attempt to update hostel again
          >
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<HostelInput> = (data) => {
    handleUpdate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Update Hostel</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Update Hostel
              </h2>
            </div>
            <p className="text-sm">Edit Existing Hostel</p>
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
                  name="hostelName"
                  label="Hostel Name"
                />
                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={control}
                  name="capacity"
                  label="Capacity"
                />
                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={control}
                  name="floorCount"
                  label="Floor Count"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="type"
                  label="Type"
                />
                <SubmitButton isLoading={isLoading}>
                  Update Hostel
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
