"use client";

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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Receipt } from "lucide-react";
import { eventSchema } from "@/lib/validation/TableValidations";

type EventFormValues = z.infer<typeof eventSchema>;

interface EventViewSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: number;
  initialData?: EventFormValues;
}

export function EventViewSheetModal({
  isOpen,
  onClose,
  initialData,
}: EventViewSheetModalProps) {
  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      type: "",
      eventName: "",
      locationName: "",
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      organizerName: "",
      description: "",
      branchId: 0,
    },
  });

  const { reset, control, setValue } = methods;

  useEffect(() => {
    // Update form values when initial data changes
    if (initialData) {
      reset(initialData);

      // Explicitly set time values
      if (initialData.startTime) {
        setValue("startTime", new Date(initialData.startTime));
      }

      if (initialData.endTime) {
        setValue("endTime", new Date(initialData.endTime));
      }
    }
  }, [initialData, reset, setValue]);

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
            <VisuallyHidden>Event Details</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Event Details
              </h2>
            </div>
            <p className="text-sm">View Event Information</p>
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
                name="branchId"
                label="Branch"
                disabled
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={control}
                name="type"
                label="Event Type"
                disabled
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={control}
                name="eventName"
                label="Event Name"
                disabled
              />
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={control}
                name="date"
                label="Event Date"
                disabled={true} // Ensure this is set to true for view-only mode
              />

              <CustomFormField
                fieldType={FormFieldType.TIME}
                control={control}
                name="startTime"
                label="Start Time"
                disabled
              />
              <CustomFormField
                fieldType={FormFieldType.TIME}
                control={control}
                name="endTime"
                label="End Time"
                disabled
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={control}
                name="locationName"
                label="Location Name"
                disabled
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={control}
                name="organizerName"
                label="Organizer Name"
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
      </SheetContent>
    </Sheet>
  );
}
