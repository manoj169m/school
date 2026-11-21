import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Sheet,
  SheetContent,
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
import { Locate, SquarePlus } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SelectItem } from "@/components/ui/select";
import { AcademicYearOption } from "@/constant/data";

interface RouteSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteCreated?: (newRouteData: RouteCreationFormValues) => Promise<void>;
}

interface Vehicle  {
  id: string;
  vehicleNumber: string;
  regNo: string;
}

export interface RouteCreationFormValues {
  routeName: string;
  numberOfStops: number;
  academicYearId: number;
  vehicleId: number;
  stops: {
    stopName: string;
    stopNumber: number;
    distance: string;
    landMark: string;
  }[];
}

const RouteValidation = z.object({
  routeName: z.string().nonempty({ message: "Route Name is required" }),
  numberOfStops: z
    .number()
    .min(1, { message: "Number of stages must be at least 1" })
    .max(100, { message: "Number of stages is too large" }),
  academicYearId: z.string().nonempty({ message: "Academic Year is required" }).transform((value) => Number(value)),
  vehicleId: z.string().nonempty({ message: "Bus Number is required" }).transform((value) => Number(value)),
  stops: z
    .array(
      z.object({
        stopName: z.string().nonempty({ message: "Stop Name is required" }),
        stopNumber: z
          .number()
          .min(1, { message: "Stop Number must be at least 1" }),
        distance: z.string().nonempty({ message: "Pickup Time is required" }),
        landMark: z.string().nonempty({ message: "Drop Time is required" }),
      })
    )
    .min(1, { message: "At least one stop is required" }),
});

export function RouteSheetModal({ isOpen, onClose}: RouteSheetModalProps) {
  const methods = useForm<RouteCreationFormValues>({
    resolver: zodResolver(RouteValidation),
    defaultValues: {
      routeName: "",
      numberOfStops: 0,
      academicYearId: 0,
      vehicleId: 0,
      stops: [],
    },
  });


  const { handleSubmit, reset, control, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stops",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [academicYear, setAcademicYear] = useState<AcademicYearOption[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("/api/vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    const fetchAcademicYear = async () => {
      try {
        const response = await axios.get("/api/academicYears");
        setAcademicYear(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchAcademicYear();
  }, []);

  // Trigger stage addition only when 'Add Stages' button is clicked
  const handleAddStages = () => {
    const numberOfStops = watch("numberOfStops");
    if (numberOfStops > fields.length) {
      const stagesToAdd = numberOfStops - fields.length;
      for (let i = 0; i < stagesToAdd; i++) {
        append({
          stopName: "",
          stopNumber: fields.length + i + 1,
          distance: "",
          landMark: "",
        });
      }
    } else if (numberOfStops < fields.length) {
      const stagesToRemove = fields.length - numberOfStops;
      for (let i = 0; i < stagesToRemove; i++) {
        remove(fields.length - 1);
      }
    }
  };

  const handleCreate = async (data: RouteCreationFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    console.log(data);

    try {
      const response = await fetch("/api/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create route");

      toast({
        title: "🙂 Success!",
        description: "Route created successfully.",
        className: styles.success,
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create route:", error);
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem creating the route.",
        className: styles.error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<RouteCreationFormValues> = (data) => {
    handleCreate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto"
        style={{ maxWidth: "60vw" }}
      >
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Add Route</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Locate className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Add Route
              </h2>
            </div>
            <p className="text-sm">Create New Route</p>
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
                    name="numberOfStops"
                    label="No of Stages"
                  />  
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={control}
                    name="academicYearId"
                    label="Academic Year"
                  >
                    {academicYear.map((academicYears) => (
                    <SelectItem key={academicYears.id} value={academicYears.id.toString()}>
                      {academicYears.label}
                    </SelectItem>
                  ))}
                </CustomFormField>

                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={control}
                    name="vehicleId"
                    label="Bus No"
                  >{vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.vehicleNumber} -  {vehicle.regNo}
                    </SelectItem>
                  ))}
                </CustomFormField>
                </div>
                <div className="flex justify-center">
                  {/* Add Button to trigger stage addition */}
                  <button
                    type="button"
                    onClick={handleAddStages}
                    className="mt-5 mb-5 bg-white text-custom-red-600 hover:bg-custom-red-600 font-semibold hover:text-white border border-custom-red-600 px-10 py-2 rounded flex items-center space-x-2"
                  >
                    <SquarePlus className="w-5 h-5" /> {/* New icon */}
                    <span>Add Stages</span> {/* Text */}
                  </button>
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
                      label={`Stop Number`}
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={control}
                      name={`stops.${index}.distance`}
                      label="Distance"
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={control}
                      name={`stops.${index}.landMark`}
                      label="Land Mark"
                    />
                  </div>
                ))}

                <SubmitButton isLoading={isLoading}>Create Route</SubmitButton>
              </form>
            </FormProvider>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
