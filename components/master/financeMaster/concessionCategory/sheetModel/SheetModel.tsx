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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Receipt } from "lucide-react";
import { ConcessionCategoryValidation } from "@/lib/validation/TableValidations";

type ConcessionCategoryInput = z.infer<typeof ConcessionCategoryValidation>;

interface ConcessionCategorySheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated?: (
    newCategoryData: ConcessionCategoryInput
  ) => Promise<void>;
}

export function ConcessionCategorySheetModal({
  isOpen,
  onClose,
}: ConcessionCategorySheetModalProps) {
  const methods = useForm<ConcessionCategoryInput>({
    resolver: zodResolver(ConcessionCategoryValidation),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { handleSubmit, reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);
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

  const handleCreate = async (data: ConcessionCategoryInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/concCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create concession category");

      toast({
        title: "🙂 Success!",
        description: "Concession Category created successfully.",
        className: styles.success,
      });

      reset(); // Reset form
      onClose(); // Close modal
    } catch (error) {
      console.error("Failed to create category:", error);

      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem creating the concession category.",
        className: styles.error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<ConcessionCategoryInput> = (data) => {
    handleCreate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Add Concession Category</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Add Concession Category
              </h2>
            </div>
            <p className="text-sm">Create a new concession category</p>
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
                  Create Category
                </SubmitButton>
              </form>
            </FormProvider>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
