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

interface DesignationSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDesignationCreated?: (
    newDesignationData: DesignationCreationFormValues
  ) => Promise<void>;
}

export interface DesignationCreationFormValues {
  title: string;
}

export const DesignationValidation = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
});

export function DesignationSheetModal({
  isOpen,
  onClose,
}: DesignationSheetModalProps) {
  const methods = useForm<DesignationCreationFormValues>({
    resolver: zodResolver(DesignationValidation),
    defaultValues: {
      title: "",
    },
  });

  const { handleSubmit, reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Hydration-safe hook: Only run on the client
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

  const handleCreate = async (data: DesignationCreationFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/designation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create designation");

      toast({
        title: "🙂 Success!",
        description: "Designation created successfully.",
        className: styles.success,
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create designation:", error);

      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem creating the designation.",
        className: styles.error,
        action: (
          <ToastAction altText="Try again" onClick={() => handleCreate(data)}>
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<DesignationCreationFormValues> = (data) => {
    handleCreate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md">
        {/* Accessible Dialog Title */}
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Add Designation</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <BriefcaseBusiness className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Add Designation
              </h2>
            </div>
            <p className="text-sm">Create New Designation</p>
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
                  Create Designation
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
