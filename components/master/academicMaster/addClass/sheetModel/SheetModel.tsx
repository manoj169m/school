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
import { ClassValidation } from "@/lib/validation/TableValidations";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { BookOpenCheck } from "lucide-react";

interface ClassSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassCreated?: (newClassData: ClassInput) => Promise<void>;
}

type ClassInput = z.infer<typeof ClassValidation>;

export function ClassSheetModal({ isOpen, onClose }: ClassSheetModalProps) {
  const methods = useForm<ClassInput>({
    resolver: zodResolver(ClassValidation),
    defaultValues: {
      name: "",
      acronym: "",
      displayOrder: 0,
    },
  });

  const { handleSubmit, reset, control } = methods;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch existing classes for dropdown
  const fetchExistingClasses = useCallback(async () => {
    try {
      const response = await fetch("/api/classes", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      await response.json(); // Assuming this fetch logic is required
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load existing classes.",
        className: styles.error,
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) fetchExistingClasses();
  }, [isOpen, fetchExistingClasses]);

  // Handle form submission
  const handleCreate: SubmitHandler<ClassInput> = async (data) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = {
        name: data.name,
        acronym: data.acronym,
        displayOrder: Number(data.displayOrder),
      };

      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to create class");
      }

      toast({
        title: "Success!",
        description: "Class created successfully.",
        className: styles.success,
      });

      reset(); // Reset form on successful submission
      onClose(); // Close modal
    } catch (error) {
      console.error("Failed to create class:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create class.",
        className: styles.error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Add Class</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <BookOpenCheck className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Add Class
              </h2>
            </div>
            <p className="text-sm">Create New Class</p>
          </div>
        </SheetHeader>

        <div className="mt-6 mb-6">
          <hr className="flex-grow border-red-600" />
        </div>

        <div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={control}
                name="name"
                label="Class Name"
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
                label="Display Order"
                placeholder="Enter a number"
              />
              <SubmitButton isLoading={isSubmitting}>Create Class</SubmitButton>
            </form>
          </FormProvider>
          {error && <div className="text-red-500">{error}</div>}
        </div>
      </SheetContent>
    </Sheet>
  );
}
