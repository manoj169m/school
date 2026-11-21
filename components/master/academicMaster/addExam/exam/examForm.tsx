'use client';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MultiSelectCombobox } from '@/components/ui/combobox';
import { SelectItem } from '@/components/ui/select';
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import { toast } from '@/hooks/use-toast';
import { useCascadingSelectForExame } from '@/hooks/useCascadingSelectForExam';
import { ExamSheetModal } from './examSheet';
import ExamTable from './ExamTable';
import { Exam } from './types';
import Loading from '@/app/loading';

const examSchema = z.object({
  academicYear: z.string().min(1, 'Academic Year is required'),
  branches: z.array(z.string()).min(1, "At least one branch is required"),
  classes: z.array(z.string()).min(1, "At least one class is required"),
  sections: z.array(z.string()).min(1, "At least one section is required"),
});

export type ExamFormValues = z.infer<typeof examSchema>;

const ExamForm = () => {
  const [showTable, setShowTable] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [examFormData, setExamFormData] = useState<ExamFormValues | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);

  const methods = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      academicYear: '',
      branches: [],
      classes: [],
      sections: [],
    },
  });

  const {
    academicYears,
    branches,
    classes,
    sections,
    isCastLoading,
    onAcademicYearChange,
    onBranchesChange,
    onClassesChange,
    onSectionsChange,
  } = useCascadingSelectForExame(methods);

  const { handleSubmit, watch } = methods;
  const selectedBranches = watch("branches");
  const selectedClasses = watch("classes");
  const selectedSections = watch("sections");

  const fetchExams = async (data: ExamFormValues) => {
    try {
      const queryParams = new URLSearchParams({
        academicYearId: data.academicYear,
        branchIds: data.branches.join(','),
        classIds: data.classes.join(','),
        sectionIds: data.sections.join(','),
      });

      const response = await fetch(`/api/exam/fetch?${queryParams}`);
      const fetchedExams = await response.json();
      setExams(fetchedExams);
      
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch exams',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteExam = async (examId: number) => {
    try {
      const response = await fetch(`/api/exam/${examId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete exam');
      }

      // Update the local state to remove the deleted exam
      setExams(prevExams => prevExams.filter(exam => exam.id !== examId));
      
      toast({
        title: 'Success',
        description: 'Exam deleted successfully',
      });

      // Refresh the exam list if needed
      if (examFormData) {
        await fetchExams(examFormData);
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete exam',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: ExamFormValues) => {
    setLoading(true);
    setShowTable(true);
    setExamFormData(data);

    try {
      await fetchExams(data);
      toast({ title: 'Success', description: 'Exams fetched successfully' });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch exams',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <Card>
        <CardHeader>
          <CardTitle>Exam Search</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-custom-pink-300 text-white hover:bg-custom-red-700"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Search'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      {loading ? (
        <Loading /> // Show loading animation
      ) : showTable ? (
        <ExamTable
          exams={exams}
          onAddExam={() => setShowExamForm(true)}
          onDeleteExam={handleDeleteExam}
        />
      ) : null}

      <ExamSheetModal
        isOpen={showExamForm}
        onClose={() => setShowExamForm(false)}
        examFormData={examFormData}
      />
    </div>
  );
};

export default ExamForm;
