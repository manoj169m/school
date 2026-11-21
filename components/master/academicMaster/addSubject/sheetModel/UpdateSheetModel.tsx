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
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { SubjectValidation } from "@/lib/validation/TableValidations";
import { BookCheck } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Validation Schema
type SubjectInput = z.infer<typeof SubjectValidation>;

// Props Interface
interface SubjectUpdateSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId?: number;
  initialData?: SubjectInput;
  onSubjectUpdated?: (updatedSubjectData: SubjectInput) => Promise<void>;
}

export function SubjectUpdateSheetModal({
  isOpen,
  onClose,
  subjectId,
  initialData,
  onSubjectUpdated,
}: SubjectUpdateSheetModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form Initialization
  const methods = useForm<SubjectInput>({
    resolver: zodResolver(SubjectValidation),
    defaultValues: initialData || {
      name: "",
      code: "",
      description: "",
    },
  });

  const { handleSubmit, reset, control } = methods;
  const [error, setErrorMessage] = useState<string | null>(null);
  console.log(setErrorMessage);

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

  // Handle Subject Update
  const handleUpdate = async (data: SubjectInput) => {
    if (!subjectId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No subject ID provided for update.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/subjects/${subjectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update subject");

      const result = await response.json();
      console.log(result);

      toast({
        title: "Success",
        description: "Subject updated successfully.",
      });

      if (onSubjectUpdated) {
        await onSubjectUpdated(data);
      }

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update subject:", error);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem updating the subject.",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => handleSubmit(handleUpdate)()}
          >
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Update Subject</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <BookCheck className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Update Subject
              </h2>
            </div>
            <p className="text-sm">Edit Existing Subject</p>
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
              <form
                onSubmit={handleSubmit(handleUpdate)}
                className="space-y-4 mt-4"
              >
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="name"
                  label="Subject Name"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="code"
                  label="Subject Code"
                />

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={control}
                  name="description"
                  label="Description"
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 bg-custom-pink-300 text-white hover:bg-custom-red-600 hover:text-white"
                >
                  {isLoading ? "Updating..." : "Update Subject"}
                </Button>
              </form>
            </FormProvider>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
