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
import SubmitButton from "@/components/ui/SubmitButton";
import { useToast } from "@/hooks/use-toast";
import styles from "@/public/assets/styles/toast.module.css";
import { ToastAction } from "@/components/ui/toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Receipt } from "lucide-react";
import {
  EventFormValues,
  eventSchema,
} from "@/lib/validation/TableValidations";
import { SelectItem } from "@/components/ui/select";
import { EvenTypes } from "@/constant/data";

interface Branch {
  id: string;
  label: string;
}

interface EventSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: (newEventData: EventFormValues) => Promise<void>;
}

export function EventSheetModal({
  isOpen,
  onClose,
  onEventCreated,
}: EventSheetModalProps) {
  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
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

  const { handleSubmit, reset, control } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>([]);

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

  const handleCreate = async (data: EventFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Format the dates before sending to the API
      const formattedData = {
        ...data,
        branchId: data.branchId === "all" ? "all" : Number(data.branchId),
        date: data.date.toISOString(),
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
      };

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) throw new Error("Failed to create Event");

      const result = await response.json();
      console.log(result);

      if (onEventCreated) {
        await onEventCreated(data);
      }

      toast({
        title: "🙂 Success!",
        description: "Event created successfully.",
        className: styles.success,
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create Event:", error);
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem creating the Event.",
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

  const onSubmit: SubmitHandler<EventFormValues> = (data) => {
    handleCreate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto">
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Add Event</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Add Event
              </h2>
            </div>
            <p className="text-sm">
              Enter the upcoming event details of the academy
            </p>
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
                <SubmitButton isLoading={isLoading}>Create Event</SubmitButton>
              </form>
            </FormProvider>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
