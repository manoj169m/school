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
import { CategoryValidation } from "@/lib/validation/TableValidations";
import { Receipt } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type CategoryInput = z.infer<typeof CategoryValidation>;

interface CategoryUpdateSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: number; // Optional ID for existing category
  initialData?: CategoryInput;
  onCategoryUpdated?: (updatedCategoryData: CategoryInput) => Promise<void>;
}

export function CategoryUpdateSheetModal({
  isOpen,
  onClose,
  categoryId,
  initialData,
}: CategoryUpdateSheetModalProps) {
  const methods = useForm<CategoryInput>({
    resolver: zodResolver(CategoryValidation),
    defaultValues: initialData || {
      category: "",
      description: "",
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

  const handleUpdate = async (data: CategoryInput) => {
    // Ensure we have a category ID to update
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
    setErrorMessage(null);
    console.log(error);

    try {
      // Send the PUT request to update the category
      const response = await fetch(`/api/feeCategory/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Handle unsuccessful response
      if (!response.ok) throw new Error("Failed to update category");

      const result = await response.json();
      console.log(result);

      // Show success toast
      toast({
        title: "🙂 Success!",
        description: "Category updated successfully.",
        className: styles.success,
      });

      // Reset the form and close the modal after success
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update category:", error);

      // Show error toast with retry action
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem updating the category.",
        className: styles.error,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => handleUpdate(data)} // Retry logic: attempt to update category again
          >
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<CategoryInput> = (data) => {
    handleUpdate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Update Category</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Update Category
              </h2>
            </div>
            <p className="text-sm">Edit Existing Category</p>
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
                  name="category"
                  label="Category"
                />
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={control}
                  name="description"
                  label="Description"
                />
                <SubmitButton isLoading={isLoading}>
                  Update Category
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
