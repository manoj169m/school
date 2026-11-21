"use client";

import React, { useEffect,  } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

interface RouteViewSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeId?: number; // Optional route ID for fetching/viewing specific route details
  initialData?: RouteViewFormValues; // Initial data for the route
}

export interface RouteViewFormValues {
  routeName?: string;
  noOfStages?: number;
  startPoint?: string;
  endPoint?: string;
  busNo?: number;
  stops?: {
    stopName: string;
    stopNumber: number;
    pickupTime: string;
    dropTime: string;
  }[];
}

const RouteViewValidation = z.object({
  routeName: z.string().nonempty({ message: "Route Name is required" }),
  noOfStages: z.number().min(1, { message: "At least 1 stage is required" }),
  startPoint: z.string().nonempty({ message: "Start Point is required" }),
  endPoint: z.string().nonempty({ message: "End Point is required" }),
  busNo: z.number().min(1, { message: "Bus Number is required" }),
  stops: z.array(
    z.object({
      stopName: z.string().nonempty({ message: "Stop Name is required" }),
      stopNumber: z
        .number()
        .min(1, { message: "Stop Number must be at least 1" }),
      pickupTime: z.string().nonempty({ message: "Pickup Time is required" }),
      dropTime: z.string().nonempty({ message: "Drop Time is required" }),
    })
  ),
});

export function RouteViewSheetModal({
  isOpen,
  onClose,
  initialData,
}: RouteViewSheetModalProps) {
  const methods = useForm<RouteViewFormValues>({
    resolver: zodResolver(RouteViewValidation),
    defaultValues: initialData || {
      routeName: "",
      noOfStages: 1,
      startPoint: "",
      endPoint: "",
      busNo: 0,
      stops: [],
    },
  });

  const { reset, control } = methods;

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
      <SheetContent className="bg-white sheet-content">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold mb-4">
            <h1>Route Details</h1>
            <p className="text-sm">View Route Information</p>
          </SheetTitle>
          <SheetDescription>
            <FormProvider {...methods}>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={control}
                    name="routeName"
                    label="Route Name"
                    disabled
                  />
                  <CustomFormField
                    fieldType={FormFieldType.NUMBER}
                    control={control}
                    name="noOfStages"
                    label="No of Stages"
                    disabled
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={control}
                    name="startPoint"
                    label="Start Point"
                    disabled
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={control}
                    name="endPoint"
                    label="End Point"
                    disabled
                  />
                  <CustomFormField
                    fieldType={FormFieldType.NUMBER}
                    control={control}
                    name="busNo"
                    label="Bus No"
                    disabled
                  />
                </div>

                {/* Display stop details */}
                {initialData?.stops?.map((stop, index) => (
                  <div className="flex space-x-4" key={index}>
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={control}
                      name={`stops.${index}.stopName`}
                      label={`Stop Name ${index + 1}`}
                      disabled
                    />
                    <CustomFormField
                      fieldType={FormFieldType.NUMBER}
                      control={control}
                      name={`stops.${index}.stopNumber`}
                      label="Stop Number"
                      disabled
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={control}
                      name={`stops.${index}.pickupTime`}
                      label="Pickup Time"
                      disabled
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={control}
                      name={`stops.${index}.dropTime`}
                      label="Drop Time"
                      disabled
                    />
                  </div>
                ))}

                <Button
                  onClick={onClose}
                  className="w-full mt-4 bg-custom-blue-300 text-white hover:bg-custom-blue-600 hover:text-white"
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </FormProvider>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
