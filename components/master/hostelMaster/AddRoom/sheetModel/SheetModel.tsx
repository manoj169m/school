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
//import { AcademicYearOption } from "@/constant/data";
import { Hostel } from "@/lib/validation/TableValidations";

interface HostelSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHostelCreated?: (newHostelData: HostelCreationFormValues) => Promise<void>;
}



export interface HostelCreationFormValues {
  hostelId: number;
  floorNumber: number;
  numberOfRooms: number;
  rooms: {
    roomNumber: string;
    capacity: number;
  }[];
}

const HostelValidation = z.object({
  hostelId: z.string().nonempty({ message: "Hostel Name is required" }).transform((value) => Number(value)),
  floorNumber: z
    .string()
    .nonempty({ message: "Academic Year is required" }).transform((value) => Number(value)),
  numberOfRooms: z
    .number()
    .min(1, { message: "Number of rooms must be at least 1" })
    .max(100, { message: "Number of rooms is too large" }),
  rooms: z
    .array(
      z.object({
        roomNumber: z.string().nonempty({ message: "Room Number is required" }),
        capacity: z.number()
          .min(1, { message: "Number of rooms must be at least 1" })
          .max(100, { message: "Number of rooms is too large" }),
      })
    )
    .min(1, { message: "At least one room is required" }),
});

export function HostelSheetModal({ isOpen, onClose }: HostelSheetModalProps) {
  const methods = useForm<HostelCreationFormValues>({
    resolver: zodResolver(HostelValidation),
    defaultValues: {
      hostelId: 0,
      floorNumber: 0,
      numberOfRooms: 0,
      rooms: [],
    },
  });

  const { handleSubmit, reset, control, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  // const [academicYear, setAcademicYear] = useState<AcademicYearOption[]>([]);
  const [hostels, setHostel] = useState<Hostel[]>([]);
  const selectedHostelId = watch("hostelId");
  const { toast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch academic years
        // const academicYearResponse = await axios.get("/api/academicYears");
        // setAcademicYear(academicYearResponse.data);

        // Fetch hostels
        const hostelResponse = await axios.get("/api/hostels");
        setHostel(hostelResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getFloorOptions = () => {
    const selectedHostel = hostels.find(
      (hostel) => hostel.id === Number(selectedHostelId)
    );
    return selectedHostel
      ? Array.from({ length: selectedHostel.floorCount }, (_, i) => i + 1)
      : [];
  };


  // Trigger room addition only when 'Add Rooms' button is clicked
  const handleAddRooms = () => {
    const numberOfRooms = watch("numberOfRooms");
    if (numberOfRooms > fields.length) {
      const roomsToAdd = numberOfRooms - fields.length;
      for (let i = 0; i < roomsToAdd; i++) {
        append({
          roomNumber: "",
          capacity: 0,
        });
      }
    } else if (numberOfRooms < fields.length) {
      const roomsToRemove = fields.length - numberOfRooms;
      for (let i = 0; i < roomsToRemove; i++) {
        remove(fields.length - 1);
      }
    }
  };

  const handleCreate = async (data: HostelCreationFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    console.log(data);

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create hostel");

      toast({
        title: "🙂 Success!",
        description: "Hostel created successfully.",
        className: styles.success,
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create hostel:", error);
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem creating the hostel.",
        className: styles.error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<HostelCreationFormValues> = (data) => {
    handleCreate(data);
    console.log(data);

  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto"
        style={{ maxWidth: "60vw" }}
      >
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Add Room</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Locate className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Add Room
              </h2>
            </div>
            <p className="text-sm">Create New Room</p>
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
                    fieldType={FormFieldType.SELECT}
                    control={control}
                    name="hostelId"
                    label="Hostel Name"
                  >
                    {hostels.map((hostel) => (
                      <SelectItem key={hostel.id} value={hostel.id.toString()}>
                        {hostel.hostelName}
                      </SelectItem>
                    ))}
                  </CustomFormField>

                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={control}
                    name="floorNumber"
                    label="Floor Number"
                  >
                    {getFloorOptions().map((floor) => (
                      <SelectItem key={floor} value={floor.toString()}>
                        {floor}
                      </SelectItem>
                    ))}
                  </CustomFormField>
                  <CustomFormField
                    fieldType={FormFieldType.NUMBER}
                    control={control}
                    name="numberOfRooms"
                    label="Number of Rooms"

                  />

                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleAddRooms}
                    className="mt-5 mb-5 bg-white text-custom-red-600 hover:bg-custom-red-600 font-semibold hover:text-white border border-custom-red-600 px-10 py-2 rounded flex items-center space-x-2"
                  >
                    <SquarePlus className="w-5 h-5" />
                    <span>Add Rooms</span>
                  </button>
                </div>

                {fields.map((field, index) => (
                  <div className="flex space-x-4" key={field.id}>
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={control}
                      name={`rooms.${index}.roomNumber`}
                      label={`Room Number ${index + 1}`}
                    />
                    <CustomFormField
                      fieldType={FormFieldType.NUMBER}
                      control={control}
                      name={`rooms.${index}.capacity`}
                      label="Room Capacity"
                    />
                  </div>
                ))}

                <SubmitButton isLoading={isLoading}>Create Hostel</SubmitButton>
              </form>
            </FormProvider>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
