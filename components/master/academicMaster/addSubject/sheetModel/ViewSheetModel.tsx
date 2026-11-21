import React, { useEffect } from "react";
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
import { SubjectValidation } from "@/lib/validation/TableValidations";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { BookCheck } from "lucide-react";
// Validation Schema

// Type Definitions
type SubjectInput = z.infer<typeof SubjectValidation>;

// Props Interface
interface SubjectViewSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId?: number; // Optional ID for existing subject
  initialData?: SubjectInput;
}

export function SubjectViewSheetModal({
  isOpen,
  onClose,
  initialData,
}: SubjectViewSheetModalProps) {
  // Form Initialization
  const methods = useForm<SubjectInput>({
    resolver: zodResolver(SubjectValidation),
    defaultValues: initialData || {
      name: "",
      code: "",
      description: "",
    },
  });

  const { reset, control } = methods;

  // Reset form when initial data changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Manage body class for modal open state
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
            <VisuallyHidden>Subject Details</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <BookCheck className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Subject Details
              </h2>
            </div>
            <p className="text-sm">View Subject Information</p>
          </div>
        </SheetHeader>

        <div className="mt-6 mb-6">
          <hr className="flex-grow border-red-600" />
        </div>

        <FormProvider {...methods}>
          <form className="space-y-4 mt-4">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={control}
              name="name"
              label="Subject Name"
              disabled
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={control}
              name="code"
              label="Subject Code"
              disabled
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={control}
              name="description"
              label="Description"
              disabled
            />

            <Button
              type="button"
              onClick={onClose}
              className="w-full mt-4 bg-custom-pink-300 text-white hover:bg-custom-red-600 hover:text-white"
              variant="outline"
            >
              Close
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
