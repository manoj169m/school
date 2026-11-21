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
import { SectionValidation } from "@/lib/validation/TableValidations";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { LayoutPanelTop } from "lucide-react";

interface SheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSectionCreated?: (newSectionData: SectionInput) => Promise<void>;
}

type SectionInput = z.infer<typeof SectionValidation>;

export function SheetModal({ isOpen, onClose }: SheetModalProps) {
  const methods = useForm<SectionInput>({
    resolver: zodResolver(SectionValidation),
    defaultValues: {
      name: "",
      acronym: "",
      displayOrder: 0,
    },
  });

  const { handleSubmit, reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleCreate = async (data: SectionInput) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Handle unsuccessful response
      if (!response.ok) throw new Error("Failed to create section");

      const result = await response.json();
      console.log(result);

      // Show success toast
      toast({
        title: "🙂 Success!",
        description: "Section created successfully.",
        className: styles.success,
      });

      // Optional callback for parent component
      // if (onSectionCreated) {
      //   await onSectionCreated(data);
      // }

      // Reset the form and close the modal after success
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create section:", error);

      // Show error toast with retry action
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem creating the section.",
        className: styles.error,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => handleCreate(data)} // Retry logic: attempt to create section again
          >
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<SectionInput> = (data) => {
    handleCreate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Add Section</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <LayoutPanelTop className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Add Section
              </h2>
            </div>
            <p className="text-sm">Create New Section</p>
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
                  label="Section"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="acronym"
                  label="Acronym"
                />

                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={control}
                  name="displayOrder"
                  label="DisplayOrder"
                />
                <SubmitButton isLoading={isLoading}>
                  Create Section
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
