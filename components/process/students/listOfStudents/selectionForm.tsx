'use client';

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { MultiSelectCombobox } from "@/components/ui/combobox";
import { StudentStatusFormValues } from "@/types/student-status";
import { z } from "zod";
import { useCascadingSelectForStudentStatus } from "@/hooks/useCascadingSelectForStudent";
import { DataTable } from "./table/data-table";
import {columns} from './table/columns'
import StudentAnalysisDashboard from "./card/StudentAnalysis";
import StudentAnalyticsTables from "./card/StudentAnalyticsTable";
import { StudentData } from "./table/schema";



const studentStatusSchema = z.object({
  academicYear: z.string().min(1, "Academic year is required"),
  branches: z.array(z.string()).min(1, "At least one branch is required"),
  classes: z.array(z.string()).min(1, "At least one class is required"),
  sections: z.array(z.string()).min(1, "At least one section is required"),
  status: z.string().min(1, "Status is required")
});


const StudentStatusForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<StudentData[]>([]);

  const methods = useForm<StudentStatusFormValues>({
    resolver: zodResolver(studentStatusSchema),
    defaultValues: {
      academicYear: "",
      branches: [],
      classes: [],
      sections: [],
      status: "",
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
  } = useCascadingSelectForStudentStatus(methods);

  const { handleSubmit, watch, formState: { errors } } = methods;

  const selectedBranches = watch("branches");
  const selectedClasses = watch("classes");
  const selectedSections = watch("sections");

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" }
  ];

  const handleFormSubmit = async (formData: StudentStatusFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Construct query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('academicYearId', formData.academicYear);
      formData.branches.forEach(branch => queryParams.append('branchIds', branch));
      formData.classes.forEach(class_ => queryParams.append('classIds', class_));
      formData.sections.forEach(section => queryParams.append('sectionIds', section));
      queryParams.append('status', formData.status);

      // Fetch students data
      const response = await fetch(`/api/students/status?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data);

      toast({
        title: "Success",
        description: `Found ${data.length} students with ${formData.status.toLowerCase()} status`,
      });

    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to fetch student data');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch student data.',
        className: 'bg-red-50 border-custom-red-600',
      });
    } finally {
      setIsLoading(false);
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
    <div className="space-y-8">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white p-6 rounded-lg shadow-md mb-8">
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
                <p className="text-sm text-red-500">
                  {errors.branches.message}
                </p>
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
                <p className="text-sm text-red-500">
                  {errors.classes.message}
                </p>
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
                <p className="text-sm text-red-500">
                  {errors.sections.message}
                </p>
              )}
            </div>

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={methods.control}
              name="status"
              label="Student Status"
              placeholder="Select status"
              mandatory={true}
            >
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </CustomFormField>
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

          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </form>
      </FormProvider>
      {students.length > 0 && (
        <div className="mt-8">
          <DataTable
            columns={columns}
            data={students}
           // searchKey="student.firstName"
          />
        </div>
      )}
      {students.length > 0 && (
  <>
    <StudentAnalysisDashboard data={students} />
    <StudentAnalyticsTables data={students} />
  </>
)}
      
    </div>
  );
};

export default StudentStatusForm;