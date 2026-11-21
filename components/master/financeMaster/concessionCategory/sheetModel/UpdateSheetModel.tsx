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
import { Receipt } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ConcessionCategoryValidation } from "@/lib/validation/TableValidations";

// Define the input type based on validation schema
type ConcessionCategoryInput = z.infer<typeof ConcessionCategoryValidation>;

interface ConcessionCategoryUpdateSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: number; // Optional ID for existing category
  initialData?: ConcessionCategoryInput;
}

export function ConcessionCategoryUpdateSheetModal({
  isOpen,
  onClose,
  categoryId,
  initialData,
}: ConcessionCategoryUpdateSheetModalProps) {
  const methods = useForm<ConcessionCategoryInput>({
    resolver: zodResolver(ConcessionCategoryValidation),
    defaultValues: initialData || {
      name: "",
      description: "",
    },
  });

  const { handleSubmit, reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const handleUpdate = async (data: ConcessionCategoryInput) => {
    if (!categoryId) {
      toast({
        variant: "destructive",
        title: "😥 Error",
        description: "No category ID provided for update.",
        className: styles.error,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/concCategory/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update concession category");

      toast({
        title: "🙂 Success!",
        description: "Concession Category updated successfully.",
        className: styles.success,
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update category:", error);
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem updating the concession category.",
        className: styles.error,
        action: (
          <ToastAction altText="Try again" onClick={() => handleUpdate(data)}>
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<ConcessionCategoryInput> = (data) => {
    handleUpdate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Update Concession Category</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Update Concession Category
              </h2>
            </div>
            <p className="text-sm">Edit Existing Concession Category</p>
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
                  placeholder="Enter category name"
                />
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={control}
                  name="description"
                  label="Description"
                  placeholder="Enter description (optional)"
                />
                <SubmitButton isLoading={isLoading}>
                  Update Category
                </SubmitButton>
              </form>
            </FormProvider>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
