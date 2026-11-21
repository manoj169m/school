"use client";

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
import { eventSchema } from "@/lib/validation/TableValidations";
import {  EvenTypes } from "@/constant/data";
import { SelectItem } from "@/components/ui/select";

interface Branch {
  id: string;
  label: string;
}

type EventFormValues = z.infer<typeof eventSchema>;

interface EventUpdateSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: number; // Optional ID for existing event
  initialData?: EventFormValues;
  onEventUpdated?: (updatedEventData: EventFormValues) => Promise<void>;
}

export function EventUpdateSheetModal({
  isOpen,
  onClose,
  eventId,
  initialData,
  onEventUpdated,
}: EventUpdateSheetModalProps) {
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

  const { handleSubmit, reset, control, setValue } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>([]);

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

   useEffect(() => {
      const fetchBranches = async () => {
        try {
          const response = await fetch("/api/branches");
          if (!response.ok) throw new Error("Failed to fetch branches");
          const data: Branch[] = await response.json();
          setBranches(data);
        } catch (error) {
          console.error("Failed to fetch branches:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch branches. Please try again.",
          });
        }
      };
  
      if (isOpen) {
        fetchBranches();
      }
    }, [isOpen, toast]);

  const handleUpdate = async (data: EventFormValues) => {
    // Ensure we have an event ID to update
    if (!eventId) {
      toast({
        variant: "destructive",
        title: "😥 Error",
        description: "No event ID provided for update.",
        className: styles.error,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Format the dates before sending to the API
      const formattedData = {
        ...data,
        date: data.date.toISOString(),
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
      };

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) throw new Error("Failed to update event");

      const result = await response.json();
      console.log(result);

      toast({
        title: "🙂 Success!",
        description: "Event updated successfully.",
        className: styles.success,
      });

      if (onEventUpdated) {
        await onEventUpdated(data);
      }

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update event:", error);
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem updating the event.",
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

  const onSubmit: SubmitHandler<EventFormValues> = (data) => {
    handleUpdate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Update Event</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Update Event
              </h2>
            </div>
            <p className="text-sm">Edit the details of the event</p>
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
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name="branchId"
                  label="Branch"
                >
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.label}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name="type"
                  label="Event Type"
                  placeholder="Select event"
                >
                  {EvenTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="eventName"
                  placeholder="Enter event name"
                  label="Event Name"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={control}
                  name="date"
                  placeholder="Select event date"
                  label="Event Date"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.TIME}
                  control={control}
                  name="startTime"
                  placeholder="Select start time"
                  label="Start Time"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.TIME}
                  control={control}
                  name="endTime"
                  placeholder="Select end time"
                  label="End Time"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="locationName"
                  placeholder="Enter location"
                  label="Location Name"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="organizerName"
                  placeholder="Enter organizer name"
                  label="Organizer Name"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={control}
                  name="description"
                  placeholder="Enter event description"
                  label="Description"
                  mandatory={true}
                />
                <SubmitButton isLoading={isLoading}>Update Event</SubmitButton>
              </form>
            </FormProvider>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
