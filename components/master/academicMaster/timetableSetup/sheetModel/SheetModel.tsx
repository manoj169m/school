import React, { useState, useCallback } from "react";
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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { BookOpenCheck } from "lucide-react";
import { SelectItem } from "@/components/ui/select";
import { useCascadingSelectTimetable } from "@/hooks/useCascadingTimetable";
import { Checkbox } from "@/components/ui/checkbox";

// Constants
const periodTypes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const daysTypes = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Interfaces and Types
interface PeriodSelection {
  [key: string]: {
    [key: string]: boolean;
  };
}

// Updated Zod validation schema with string type for applicableDate
const TimetableValidation = z.object({
  academicYear: z.string().min(1, "Academic year is required"),
  branch: z.string().min(1, "Branch is required"),
  class: z.string().min(1, "Class is required"),
  section: z.string().min(1, "Section is required"),
  teacher: z.string().min(1, "Teacher is required"),
  subject: z.string().min(1, "Subject is required"),
  period: z.string().min(1, "Period is required"),
  days: z.string().min(1, "Days is required"),
  applicableDate: z.string().min(1, "Date is required"),
});

type TimetableInput = z.infer<typeof TimetableValidation>;

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
  };
}

interface TimetableSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimetableCreated?: (newTimetableData: TimetableInput) => Promise<void>;
}

interface SubmissionData extends TimetableInput {
  periodSelections: {
    [key: string]: string[];
  };
}

export function TimetableSheetModal({
  isOpen,
  onClose,
  onTimetableCreated,
}: TimetableSheetModalProps) {
  const [selectedPeriods, setSelectedPeriods] = useState<PeriodSelection>(
    () => {
      const initial: PeriodSelection = {};
      daysTypes.forEach((day) => {
        initial[day] = {};
        periodTypes.forEach((period) => {
          initial[day][period] = false;
        });
      });
      return initial;
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  console.log(error);
  // Updated defaultValues with string type for applicableDate
  const methods = useForm<TimetableInput>({
    resolver: zodResolver(TimetableValidation),
    defaultValues: {
      academicYear: "",
      branch: "",
      class: "",
      section: "",
      teacher: "",
      subject: "",
      period: "",
      days: "",
      applicableDate: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  console.log(errors);
  const {
    academicYears,
    branches,
    classes,
    sections,
    isCastLoading,
    onAcademicYearChange,
    onBranchChange,
    onClassChange,
  } = useCascadingSelectTimetable(methods);

  const handlePeriodSelect = useCallback((day: string, period: string) => {
    setSelectedPeriods((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [period]: !prev[day][period],
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    reset({
      ...methods.getValues(),
      applicableDate: new Date().toISOString().split("T")[0],
    });
    setSelectedPeriods(() => {
      const initial: PeriodSelection = {};
      daysTypes.forEach((day) => {
        initial[day] = {};
        periodTypes.forEach((period) => {
          initial[day][period] = false;
        });
      });
      return initial;
    });
    setError(null);
  }, [reset, methods]);

  const handleCreate: SubmitHandler<TimetableInput> = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const transformedPeriods = Object.entries(selectedPeriods).reduce(
        (acc, [day, periods]) => {
          acc[day] = Object.entries(periods)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, isSelected]) => isSelected)
            .map(([period]) => period);
          return acc;
        },
        {} as Record<string, string[]>
      );
      

      const submissionData: SubmissionData = {
        ...formData,
        periodSelections: transformedPeriods,
      };

      const response = await fetch("/api/periodAllocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create timetable");
      }

      toast({
        title: "Success!",
        description: "Timetable created successfully.",
        className: styles.success,
      });

      if (onTimetableCreated) {
        await onTimetableCreated(formData);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to create timetable:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create timetable"
      );
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create timetable",
        className: styles.error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto"
        style={{ maxWidth: "80vw" }}
      >
        {/* SheetHeader remains the same */}
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Add Timetable</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <BookOpenCheck className="w-5 h-5 text-custom-red-600" />
              <h2 className="text-custom-red-600 font-semibold text-xl rounded">
                Add Timetable
              </h2>
            </div>
            <p className="text-sm">Create New Timetable</p>
          </div>
        </SheetHeader>

        <div className="mt-6 mb-6">
          <hr className="flex-grow border-red-600" />
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-6">
            {/* Date Selection */}
            <div className="grid grid-cols-1 gap-4">
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={methods.control}
                name="applicableDate"
                label="Applicable Date"
                placeholder="Select date"
                mandatory={true}
              />
            </div>

            {/* Rest of the form fields remain the same */}
            {/* Academic Year and Branch */}
            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={methods.control}
                name="academicYear"
                label="Academic Year"
                placeholder="Select year"
                mandatory={true}
                onChange={onAcademicYearChange}
              >
                {academicYears.map((year) => (
                  <SelectItem key={year.id} value={year.id.toString()}>
                    {year.label || year.name}
                  </SelectItem>
                ))}
              </CustomFormField>

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={methods.control}
                name="branch"
                label="Branch"
                placeholder="Select branch"
                mandatory={true}
                onChange={onBranchChange}
                disabled={isCastLoading.branches}
              >
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.label || branch.name}
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>

            {/* Class and Section */}
            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={methods.control}
                name="class"
                label="Class"
                placeholder="Select class"
                mandatory={true}
                onChange={onClassChange}
                disabled={isCastLoading.classes}
              >
                {classes.map((classItem) => (
                  <SelectItem
                    key={classItem.id}
                    value={classItem.id.toString()}
                  >
                    {classItem.label || classItem.name}
                  </SelectItem>
                ))}
              </CustomFormField>

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={methods.control}
                name="section"
                label="Section"
                placeholder="Select section"
                mandatory={true}
                disabled={isCastLoading.sections}
              >
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id.toString()}>
                    {section.label || section.name}
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>

            {/* Teacher and Subject */}
            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={methods.control}
                name="teacher"
                label="Teacher Name"
                placeholder="Select teacher"
                mandatory={true}
              >
                {["Mr. Smith", "Mrs. Johnson"].map((teacher) => (
                  <SelectItem key={teacher} value={teacher}>
                    {teacher}
                  </SelectItem>
                ))}
              </CustomFormField>

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={methods.control}
                name="subject"
                label="Subject"
                placeholder="Select subject"
                mandatory={true}
              >
                {["Mathematics", "Science", "English"].map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>

            {/* Period Selection Grid */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Period Selection</h3>
              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  {/* Header */}
                  <div className="font-semibold">Days</div>
                  <div className="grid grid-cols-10 gap-2">
                    {periodTypes.map((period) => (
                      <div key={period} className="text-center font-semibold">
                        {period}
                      </div>
                    ))}
                  </div>

                  {/* Days and Checkboxes */}
                  {daysTypes.map((day) => (
                    <React.Fragment key={day}>
                      <div className="flex items-center">{day}</div>
                      <div className="grid grid-cols-10 gap-2">
                        {periodTypes.map((period) => (
                          <div
                            key={`${day}-${period}`}
                            className="flex justify-center items-center"
                          >
                            <Checkbox
                              id={`${day}-${period}`}
                              checked={selectedPeriods[day][period]}
                              onCheckedChange={() =>
                                handlePeriodSelect(day, period)
                              }
                              className="h-5 w-5"
                            />
                          </div>
                        ))}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <SubmitButton isLoading={isSubmitting}>
              Create Timetable
            </SubmitButton>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}

export default TimetableSheetModal;
