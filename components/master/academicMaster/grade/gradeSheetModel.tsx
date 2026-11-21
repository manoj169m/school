'use client';
import React, {  useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import styles from '@/public/assets/styles/toast.module.css';
import { ToastAction } from '@/components/ui/toast';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Receipt } from 'lucide-react';
import { z } from 'zod';
import SubmitButton from '@/components/ui/SubmitButton';
import { GradeFormValues } from './gradeForm';

// Updated validation schema to match database schema
const GradeValidation = z.object({
  minMarks: z.number().min(0),
  maxMarks: z.number().min(0),
  grade: z.string().optional(),
  description: z.string().optional(),
});

export type GradeInput = z.infer<typeof GradeValidation>;


interface GradeSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: GradeFormValues;
}

export function GradeSheetModal({ isOpen, onClose, formData }: GradeSheetModalProps) {
  const methods = useForm<GradeInput>({
    resolver: zodResolver(GradeValidation),
    defaultValues: {
      minMarks: 0,
      maxMarks: 0,
      grade: '',
      description: '',
    },
  });

  const { handleSubmit, reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();


  const handleCreate = async (data: GradeInput) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          academicYearId:  parseInt(formData.academicYear, 10),
          branchId: formData.branches.map(branch => parseInt(branch, 10)),  // Already an array from your form
          classId: formData.classes.map(cls => parseInt(cls, 10)), // Already an array from your form
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create grade');
      }
  
      const result = await response.json();
      console.log(result);
      
  
      toast({
        title: '🎉 Success!',
        description: 'Grade created successfully.',
        className: styles.success,
      });
  
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create grade:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create grade. Please try again.',
        className: styles.error,
        action: (
          <ToastAction altText="Try again" onClick={() => handleCreate(data)}>
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
            <VisuallyHidden>Add Grade</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl">
                Add Grade
              </h2>
            </div>
            <p className="text-sm">Create New Grade</p>
          </div>
        </SheetHeader>

        <div className="mt-6 mb-6">
          <hr className="flex-grow border-red-600" />
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <CustomFormField
              fieldType={FormFieldType.NUMBER}
              control={control}
              name="minMarks"
              label="Minimum Marks"
            />
            <CustomFormField
              fieldType={FormFieldType.NUMBER}
              control={control}
              name="maxMarks"
              label="Maximum Marks"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={control}
              name="grade"
              label="Grade"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={control}
              name="description"
              label="Description"
            />
            <SubmitButton isLoading={isLoading}>Create Grade</SubmitButton>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}