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
import { SectionValidation } from "@/lib/validation/TableValidations";
import { LayoutPanelTop } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export interface SectionViewSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId?: number; // Optional ID for existing section
  initialData?: SectionInput;
}

export type SectionInput = z.infer<typeof SectionValidation>;

export function SectionViewSheetModal({
  isOpen,
  onClose,
  initialData,
}: SectionViewSheetModalProps) {
  const methods = useForm<SectionInput>({
    resolver: zodResolver(SectionValidation),
    defaultValues: initialData || {
      name: "",
      acronym: "",
      displayOrder: 0,
    },
  });

  const { reset, control } = methods;

  useEffect(() => {
    // Update form values when initial data changes
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Effect to manage modal open/close body class
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
            <VisuallyHidden>Section Details</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <LayoutPanelTop className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Section Details
              </h2>
            </div>
            <p className="text-sm">View Section Information</p>
          </div>
        </SheetHeader>

        <div className="mt-6 mb-6">
          <hr className="flex-grow border-red-600" />
        </div>

        <div>
          <FormProvider {...methods}>
            <div className="space-y-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={control}
                name="name"
                label="Section"
                disabled
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={control}
                name="acronym"
                label="acronym"
                disabled
              />
              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={control}
                name="displayOrder"
                label="DisplayOrder"
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
