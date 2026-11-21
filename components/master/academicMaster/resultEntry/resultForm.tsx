'use client';

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { MultiSelectCombobox } from "@/components/ui/combobox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { ResultFormValues, useResultCascadingSelect } from "@/hooks/useResultCascadingSelect";
import StudentResultTable from "./resultTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the schema for form validation
const resultSchema = z.object({
  academicYear: z.string().min(1, "Academic year is required"),
  branches: z.array(z.string()).min(1, "At least one branch is required"),
  classes: z.array(z.string()).min(1, "At least one class is required"),
  sections: z.array(z.string()).min(1, "At least one section is required"),
  exam: z.string().min(1, "Exam is required"),
  matchedExamIds: z.array(z.number()).optional() // Add validation for matchedExamIds
});


const ResultEntryForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedValues, setSelectedValues] = useState<ResultFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // async function onSubmit(data:ResultFormValues) {
  //   console.log(data); 
  // }
  
  const methods = useForm<ResultFormValues>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      academicYear: "",
      branches: [],
      classes: [],
      sections: [],
      exam: "",
      matchedExamIds: [] // Add default value for matchedExamIds
    },
  });

  const {
    academicYears,
    branches,
    classes,
    sections,
    exams,
    isCastLoading,
    errors,
    onBranchesChange,
    onAcademicYearChange,
    onClassesChange,
    onSectionsChange,
    onExamChange,
  } = useResultCascadingSelect(methods);

  const { handleSubmit, watch, formState: { errors: formErrors } } = methods;

  const selectedBranches = watch("branches");
  const selectedClasses = watch("classes");
  const selectedSections = watch("sections");
  const matchedExamIds = watch("matchedExamIds"); // Watch matchedExamIds

  const handleFormSubmit = async (formData: ResultFormValues) => {
    try {
      setError(null);
      // await onSubmit(formData);
      setSelectedValues(formData);
      setShowResults(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit result entry form');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit result entry form.',
      });
    }
    console.log(formData);
  };
console.log(matchedExamIds);

  if (isCastLoading.academicYears) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-custom-pink-300" />
      </div>
    );
  }

  const renderError = (error: string | null) => {
    if (!error) return null;
    return (
      <Alert variant="destructive" className="mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="p-2">
      <Card>
        <CardHeader>
          <CardTitle>Result Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div>
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={methods.control}
                    name="academicYear"
                    label="Academic Year"
                    placeholder="Select year"
                    mandatory={true}
                    onChange={(value) => onAcademicYearChange(value)}
                    disabled={isCastLoading.academicYears}
                  >
                    {academicYears.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </CustomFormField>
                  {renderError(errors.academicYears)}
                  {formErrors.academicYear && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.academicYear.message}
                    </p>
                  )}
                </div>

                <div>
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
                  {renderError(errors.branches)}
                  {formErrors.branches && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.branches.message}
                    </p>
                  )}
                </div>

                <div>
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
                  {renderError(errors.classes)}
                  {formErrors.classes && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.classes.message}
                    </p>
                  )}
                </div>

                <div>
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
                  {renderError(errors.sections)}
                  {formErrors.sections && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.sections.message}
                    </p>
                  )}
                </div>

                <div>
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={methods.control}
                    name="exam"
                    label="Exam"
                    placeholder="Select exam"
                    mandatory={true}
                    onChange={(value) => onExamChange(value)}
                    disabled={isCastLoading.exams || exams.length === 0}
                  >
                    {exams.length === 0 ? (
                      <div className="text-sm">No match found</div>
                    ) : (
                      exams.map((exam) => (
                        <SelectItem key={exam.value} value={exam.value}>
                          {exam.label}
                        </SelectItem>
                      ))
                    )}
                  </CustomFormField>
                  {renderError(errors.exams)}
                  {formErrors.exam && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.exam.message}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center mt-8">
                <Button
                  className="bg-custom-pink-300 text-white px-4 py-2 rounded hover:bg-custom-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading || Object.values(isCastLoading).some(Boolean)}
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
            </form>
          </FormProvider>
        </CardContent>
      </Card>
      {showResults && selectedValues && (
        <StudentResultTable
          academicYear={selectedValues.academicYear}
          branches={selectedValues.branches}
          classes={selectedValues.classes}
          sections={selectedValues.sections}
          examId={selectedValues.exam}
          matchedExamIds={selectedValues.matchedExamIds || []} // Pass matchedExamIds to StudentResultTable
        />
      )}

      {/* {selectedValues ? (
      <GroupedResultTables
        academicYear={selectedValues.academicYear}
        branches={selectedValues.branches}
        classes={selectedValues.classes}
        sections={selectedValues.sections}
        examId={selectedValues.exam}
        matchedExamIds={selectedValues.matchedExamIds || []}
      />
    ) : null} */}
    </div>
  );
};

export default ResultEntryForm;