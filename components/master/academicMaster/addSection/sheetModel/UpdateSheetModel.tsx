import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SubmitButton from '@/components/ui/SubmitButton';
import { useToast } from "@/hooks/use-toast";
import styles from '@/public/assets/styles/toast.module.css';
import { ToastAction } from '@/components/ui/toast';
import { SectionValidation } from '@/lib/validation/TableValidations';
import { LayoutPanelTop } from 'lucide-react';

// Props and Types
export interface SectionUpdateSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId?: number;
  initialData?: SectionInput;
  onSectionUpdated?: (updatedSectionData: SectionInput) => Promise<void>;
}

export type SectionInput = z.infer<typeof SectionValidation>;

export function SectionUpdateSheetModal({
  isOpen,
  onClose,
  sectionId,
  initialData,
}: SectionUpdateSheetModalProps) {
  const methods = useForm<SectionInput>({
    resolver: zodResolver(SectionValidation),
    defaultValues: initialData || {
      name: "",
      acronym: "",
      displayOrder: 0,
    },
  });

  const { handleSubmit, reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();


  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Handle the Update Process
  const handleUpdate = async (data: SectionInput) => {
    if (!sectionId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No section ID provided for update.',
        className: styles.error,
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update section');

      toast({
        title: 'Success!',
        description: 'Section updated successfully.',
        className: styles.success,
      });

      reset();
      onClose();

    } catch (error) {
      console.log(error);
      
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'There was a problem updating the section.',
        className: styles.error,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => handleSubmit(onSubmit)()}
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
    handleUpdate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Update Section Details</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <LayoutPanelTop className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Update Section Details
              </h2>
            </div>
            <p className="text-sm">Edit Existing Section Details</p>
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
                  label="Section Name"
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
                />
                <SubmitButton isLoading={isLoading}>
                  {isLoading ? "Updating..." : "Update Section"}
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
