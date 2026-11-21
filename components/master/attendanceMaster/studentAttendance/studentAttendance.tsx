"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MultiSelectCombobox } from "@/components/ui/combobox";
import { AttendanceFormValues, FormValues } from "@/types/attendance";
import { z } from "zod";
import { useCascadingSelectForAttendance } from "@/hooks/useCascadingSelectForAttendance";

// Define the schema for form validation
const attendanceSchema = z.object({
  academicYear: z.string().min(1, "Academic year is required"),
  branches: z.array(z.string()).min(1, "At least one branch is required"),
  classes: z.array(z.string()).min(1, "At least one class is required"),
  sections: z.array(z.string()).min(1, "At least one section is required"),
  date: z.date(),
});

interface AttendanceFormProps {
  onSubmit: (data: FormValues) => Promise<void>;
  isLoading: boolean;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      academicYear: "",
      branches: [],
      classes: [],
      sections: [],
      date: new Date(),
    },
  });

  const {
    academicYears,
    branches,
    classes,
    sections,
    isCastLoading,
    onBranchesChange,
    onAcademicYearChange,
    onClassesChange,
    onSectionsChange,
  } = useCascadingSelectForAttendance(methods);

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const selectedBranches = watch("branches");
  const selectedClasses = watch("classes");
  const selectedSections = watch("sections");

  const handleFormSubmit = async (formData: AttendanceFormValues) => {
    try {
      // Transform AttendanceFormValues to FormValues
      const transformedData: FormValues = {
        academicYearId: formData.academicYear,
        branchIds: formData.branches,
        classIds: formData.classes,
        sectionIds: formData.sections,
        date: formData.date,
      };

      await onSubmit(transformedData);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit attendance form");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit attendance form.",
        className: "bg-red-50 border-custom-red-600",
      });
    }
  };

  if (isCastLoading.academicYears) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-custom-pink-300" />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={methods.control}
            name="academicYear"
            label="Academic Year"
            placeholder="Select year"
            mandatory={true}
            onChange={(value) => onAcademicYearChange(value)}
          >
            {academicYears.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </CustomFormField>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Branches<span className="text-red-500">*</span>
            </label>
            <MultiSelectCombobox
              options={branches}
              value={selectedBranches}
              onChange={onBranchesChange}
              placeholder="Select branches..."
              searchPlaceholder="Search branches..."
              disabled={isCastLoading.branches || branches.length === 0}
            />
            {errors.branches && (
              <p className="text-sm text-red-500">{errors.branches.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Classes<span className="text-red-500">*</span>
            </label>
            <MultiSelectCombobox
              options={classes}
              value={selectedClasses}
              onChange={onClassesChange}
              placeholder="Select classes..."
              searchPlaceholder="Search classes..."
              disabled={isCastLoading.classes || classes.length === 0}
            />
            {errors.classes && (
              <p className="text-sm text-red-500">{errors.classes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sections<span className="text-red-500">*</span>
            </label>
            <MultiSelectCombobox
              options={sections}
              value={selectedSections}
              onChange={onSectionsChange}
              placeholder="Select sections..."
              searchPlaceholder="Search sections..."
              disabled={isCastLoading.sections || sections.length === 0}
            />
            {errors.sections && (
              <p className="text-sm text-red-500">{errors.sections.message}</p>
            )}
          </div>

          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={methods.control}
            name="date"
            placeholder="Select date"
            label="Date"
            mandatory={true}
          />
        </div>

        <div className="flex justify-center mt-8">
          <Button
            className="bg-custom-pink-300 text-white px-4 py-2 rounded hover:bg-custom-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>

        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </form>
    </FormProvider>
  );
};

export default AttendanceForm;
