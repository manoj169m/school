import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Receipt } from "lucide-react";
import { ConcessionCategoryValidation } from "@/lib/validation/TableValidations"; // Assuming this is the shared validation schema
import { z } from "zod";

// Infer input type from validation schema
type ConcessionCategoryInput = z.infer<typeof ConcessionCategoryValidation>;

interface ConcessionCategoryViewSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: number;
  initialData?: ConcessionCategoryInput;
}

export function ConcessionCategoryViewSheetModal({
  isOpen,
  onClose,
  initialData,
}: ConcessionCategoryViewSheetModalProps) {
  const methods = useForm<ConcessionCategoryInput>({
    resolver: zodResolver(ConcessionCategoryValidation),
    defaultValues: initialData || {
      name: "",
      description: "",
    },
  });

  const { reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);
  console.log(setIsLoading);
  useEffect(() => {
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

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Concession Category Details</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Concession Category Details
              </h2>
            </div>
            <p className="text-sm">View Concession Category Information</p>
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
              <div className="space-y-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="name"
                  label="Name"
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
                  onClick={onClose}
                  className="w-full mt-4 bg-custom-pink-300 text-white hover:bg-custom-red-600 hover:text-white"
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </FormProvider>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
