'use client';
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectItem } from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from '@/hooks/use-toast';
import { MultiSelectCombobox } from "@/components/ui/combobox";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { useGradeCascadingSelect } from "@/hooks/useGradeCascadingSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { GradeSheetModal } from "./gradeSheetModel";
import GradeTable from "./gradeTable";

const gradeSchema = z.object({
  academicYear: z.string().min(1, "Academic year is required"),
  branches: z.array(z.string()).min(1, "At least one branch is required"),
  classes: z.array(z.string()).min(1, "At least one class is required"),
});

export interface GradeFormValues {
  academicYear: string;
  branches: string[];
  classes: string[];
}

interface Grade {
  id: number;
  minMarks: number;
  maxMarks: number;
  grade: string;
  description: string;
  academicYear: {
    name: string;
  };
  branch: {
    name: string;
  };
  class: {
    name: string;
  };
}

const GradeForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Formdata, setFormdata] = useState<GradeFormValues>();  // Store selected grade details

  const methods = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      academicYear: "",
      branches: [],
      classes: [],
    },
  });

  

  const { 
    academicYears, 
    branches, 
    classes, 
    isCastLoading,
    errors, 
    onBranchesChange, 
    onAcademicYearChange, 
    onClassesChange 
  } = useGradeCascadingSelect(methods);

  const { handleSubmit, watch, formState: { errors: formErrors } } = methods;

  const selectedBranches = watch("branches");
  const selectedClasses = watch("classes");

  const fetchGrades = async (formData: GradeFormValues) => {
    try {
      // Create query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('academicYearId', formData.academicYear);
      queryParams.append('branchIds', formData.branches.join(','));
      queryParams.append('classIds', formData.classes.join(','));
  
      // Note: Using /api/grades (plural) instead of /api/grade
      const response = await fetch(`/api/grade/fetch?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch grades');
      }
  
      const data = await response.json();
      setGrades(data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      throw error;
    }
  };

// Update the handleFormSubmit function
const handleFormSubmit = async (formData: GradeFormValues) => {
  try {
    setIsLoading(true);
    setError(null);
    console.log('Form Data:', formData);
    setFormdata(formData);
    
    await fetchGrades(formData);

    toast({
      title: 'Success',
      description: 'Grades fetched successfully.',
    });
  } catch (err) {
    console.error('Error submitting form:', err);
    setError('Failed to fetch grades');
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Failed to fetch grades.',
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleAddExam = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

 
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
    <div className="p-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grade Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

      {/* Pass grades and modal to GradeTable */}
      <GradeTable grades={grades} 
      handleAddExam={handleAddExam}
      formData={Formdata as GradeFormValues} 
       />

      {/* GradeSheetModal */}
      <GradeSheetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={Formdata as GradeFormValues}       />
    </div>
  );
};

export default GradeForm;
