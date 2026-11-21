import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SubmitButton from "@/components/ui/SubmitButton";
import { useToast } from "@/hooks/use-toast";
import styles from "@/public/assets/styles/toast.module.css";
import { ToastAction } from "@/components/ui/toast";

interface RouteUpdateSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeId?: number; // Optional ID for the existing route
  initialData?: RouteUpdateFormValues;
  onRouteUpdated?: (updatedRouteData: RouteUpdateFormValues) => Promise<void>;
}

export interface RouteUpdateFormValues {
  routeName: string;
  noOfStages: number;
  startPoint: string;
  endPoint: string;
  busNo: number;
  stops: {
    stopName: string;
    stopNumber: number;
    pickupTime: string;
    dropTime: string;
  }[];
}

const RouteValidation = z.object({
  routeName: z.string().nonempty({ message: "Route Name is required" }),
  noOfStages: z
    .number()
    .min(1, { message: "Number of stages must be at least 1" })
    .max(100, { message: "Number of stages is too large" }),
  startPoint: z.string().nonempty({ message: "Start Point is required" }),
  endPoint: z.string().nonempty({ message: "End Point is required" }),
  busNo: z.number().min(1, { message: "Bus Number is required" }),
  stops: z
    .array(
      z.object({
        stopName: z.string().nonempty({ message: "Stop Name is required" }),
        stopNumber: z
          .number()
          .min(1, { message: "Stop Number must be at least 1" }),
        pickupTime: z.string().nonempty({ message: "Pickup Time is required" }),
        dropTime: z.string().nonempty({ message: "Drop Time is required" }),
      })
    )
    .min(1, { message: "At least one stop is required" }),
});

export function RouteUpdateSheetModal({
  isOpen,
  onClose,
  routeId,
  initialData,
}: RouteUpdateSheetModalProps) {
  const methods = useForm<RouteUpdateFormValues>({
    resolver: zodResolver(RouteValidation),
    defaultValues: initialData || {
      routeName: "",
      noOfStages: 1,
      startPoint: "",
      endPoint: "",
      busNo: 0,
      stops: [],
    },
  });

  const { handleSubmit, reset, control, watch,  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stops",
  });

  const noOfStages = watch("noOfStages");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (noOfStages > fields.length) {
      const stagesToAdd = noOfStages - fields.length;
      for (let i = 0; i < stagesToAdd; i++) {
        append({
          stopName: "",
          stopNumber: fields.length + i + 1,
          pickupTime: "",
          dropTime: "",
        });
      }
    } else if (noOfStages < fields.length) {
      const stagesToRemove = fields.length - noOfStages;
      for (let i = 0; i < stagesToRemove; i++) {
        remove(fields.length - 1);
      }
    }
  }, [noOfStages, fields.length, append, remove]);

  const handleUpdate = async (data: RouteUpdateFormValues) => {
    if (!routeId) {
      toast({
        variant: "destructive",
        title: "😥 Error",
        description: "No route ID provided for update.",
        className: styles.error,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/route/${routeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update route");

      const result = await response.json();
      console.log(result);

      toast({
        title: "🙂 Success!",
        description: "Route updated successfully.",
        className: styles.success,
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update route:", error);

      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem updating the route.",
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

  const onSubmit: SubmitHandler<RouteUpdateFormValues> = (data) => {
    handleUpdate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold mb-4">
            <h1>Update Route</h1>
            <p className="text-sm">Edit Existing Route</p>
          </SheetTitle>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <SheetDescription>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex space-x-4">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={control}
                      name="routeName"
                      label="Route Name"
                    />
                    <CustomFormField
                      fieldType={FormFieldType.NUMBER}
                      control={control}
                      name="noOfStages"
                      label="No of Stages"
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={control}
                      name="startPoint"
                      label="Start Point"
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={control}
                      name="endPoint"
                      label="End Point"
                    />
                    <CustomFormField
                      fieldType={FormFieldType.NUMBER}
                      control={control}
                      name="busNo"
                      label="Bus No"
                    />
                  </div>

                  {fields.map((field, index) => (
                    <div className="flex space-x-4" key={field.id}>
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={control}
                        name={`stops.${index}.stopName`}
                        label={`Stop Name ${index + 1}`}
                      />
                      <CustomFormField
                        fieldType={FormFieldType.NUMBER}
                        control={control}
                        name={`stops.${index}.stopNumber`}
                        label="Stop Number"
                      />
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={control}
                        name={`stops.${index}.pickupTime`}
                        label="Pickup Time"
                      />
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={control}
                        name={`stops.${index}.dropTime`}
                        label="Drop Time"
                      />
                    </div>
                  ))}

                  <SubmitButton isLoading={isLoading}>
                    Update Route
                  </SubmitButton>
                </form>
              </FormProvider>
            </SheetDescription>
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
