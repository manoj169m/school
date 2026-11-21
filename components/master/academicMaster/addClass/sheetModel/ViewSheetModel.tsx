import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
 
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { ClassValidation } from '@/lib/validation/TableValidations';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { BookOpenCheck } from 'lucide-react';


type ClassInput = z.infer<typeof ClassValidation>;



export interface ClassViewSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId?: number; // Optional ID for existing section
  initialData?: ClassInput;
}



export function ClassViewSheetModal({ 
  isOpen, 
  onClose,  
  initialData 
}: ClassViewSheetModalProps) {
  const methods = useForm<ClassInput>({
    resolver: zodResolver(ClassValidation),
    defaultValues: initialData || {
      name: "",
      acronym: "",
      displayOrder:0,
    },
  });


  
  const { reset, control } = methods;
  const [error, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log(setIsLoading);
  console.log(setErrorMessage);

 useEffect(() => {
    // Update form values when initial data changes
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

 

   // Effect to manage modal open/close body class
   useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
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
              <BookOpenCheck className="w-5 h-5 text-custom-red-600" />
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
                  label="Section"
                  disabled
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="acronym"
                  label="Acronym"
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
            {error && <div className="text-red-500">{error}</div>}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );

}
