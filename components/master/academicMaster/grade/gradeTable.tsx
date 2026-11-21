import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import styles from '@/public/assets/styles/toast.module.css';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Receipt } from 'lucide-react';
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { z } from 'zod';
import SubmitButton from '@/components/ui/SubmitButton';
import { GradeFormValues } from './gradeForm';

const GradeValidation = z.object({
  minMarks: z.number().min(0),
  maxMarks: z.number().min(0),
  grade: z.string().optional(),
  description: z.string().optional(),
});

export type GradeInput = z.infer<typeof GradeValidation>;

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

interface GradeTableProps {
  grades: Grade[];
  handleAddExam: () => void;
  formData: GradeFormValues;
}

export const GradeTable: React.FC<GradeTableProps> = ({ grades, handleAddExam, formData }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Update Modal Functions
  const handleUpdateClick = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateClose = () => {
    setSelectedGrade(null);
    setIsUpdateModalOpen(false);
  };

  // Delete Dialog Functions
  const handleDeleteClick = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setSelectedGrade(null);
    setIsDeleteDialogOpen(false);
  };

  // Update Grade Function
  const handleUpdateGrade = async (data: GradeInput) => {
    if (!selectedGrade) return;
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/grade/${selectedGrade.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          academicYearId: parseInt(formData.academicYear, 10),
          branchId: formData.branches.map(branch => parseInt(branch, 10)),
          classId: formData.classes.map(cls => parseInt(cls, 10)),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update grade');
      }

      toast({
        title: '🎉 Success!',
        description: 'Grade updated successfully.',
        className: styles.success,
      });

      // Close modal and refresh data
      handleUpdateClose();
      // You might want to add a refresh function prop to reload the grades
    } catch (error) {
      console.error('Failed to update grade:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update grade',
        className: styles.error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Grade Function
  const handleDeleteConfirm = async () => {
    if (!selectedGrade) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/grade/${selectedGrade.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete grade');
      }

      toast({
        title: '🎉 Success!',
        description: 'Grade deleted successfully.',
        className: styles.success,
      });

      // Close dialog and refresh data
      handleDeleteClose();
      // You might want to add a refresh function prop to reload the grades
    } catch (error) {
      console.error('Failed to delete grade:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete grade',
        className: styles.error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update Form Component
  const UpdateForm = () => {
    const methods = useForm<GradeInput>({
      resolver: zodResolver(GradeValidation),
      defaultValues: {
        minMarks: selectedGrade?.minMarks || 0,
        maxMarks: selectedGrade?.maxMarks || 0,
        grade: selectedGrade?.grade || '',
        description: selectedGrade?.description || '',
      },
    });

    const { handleSubmit, control } = methods;

    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleUpdateGrade)} className="space-y-4">
          <CustomFormField
            fieldType={FormFieldType.NUMBER}
            control={control}
            name="minMarks"
            label="Minimum Marks"
          />
          <CustomFormField
            fieldType={FormFieldType.NUMBER}
            control={control}
            name="maxMarks"
            label="Maximum Marks"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="grade"
            label="Grade"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={control}
            name="description"
            label="Description"
          />
          <SubmitButton isLoading={isLoading}>Update Grade</SubmitButton>
        </form>
      </FormProvider>
    );
  };

  return (
    <>
      <Card className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
        <CardHeader className="bg-custom-blue-500 rounded-tl-lg rounded-tr-lg">
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-custom-red-600">
                Grade List: <span className="text-lg text-black">{grades.length}</span>
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">Total grades listed</p>
            </div>
            <Button
              onClick={handleAddExam}
              className="bg-custom-pink-500 text-white bg-custom-pink-300 hover:bg-custom-red-600"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Grade
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-4">
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className="bg-custom-pink-300">
                <TableRow>
                  <TableHead className="text-white">S.No</TableHead>
                  <TableHead className="text-white">Academic Year</TableHead>
                  <TableHead className="text-white">Branch</TableHead>
                  <TableHead className="text-white">Class</TableHead>
                  <TableHead className="text-white">Min Marks</TableHead>
                  <TableHead className="text-white">Max Marks</TableHead>
                  <TableHead className="text-white">Grade</TableHead>
                  <TableHead className="text-white">Description</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <p>No grades found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  grades.map((grade, index) => (
                    <TableRow key={grade.id} className="hover:bg-gray-50 transition-all duration-300">
                      <TableCell className="py-3">{index + 1}</TableCell>
                      <TableCell className="py-3">{grade.academicYear.name}</TableCell>
                      <TableCell className="py-3">{grade.branch.name}</TableCell>
                      <TableCell className="py-3">{grade.class.name}</TableCell>
                      <TableCell className="py-3">{grade.minMarks}</TableCell>
                      <TableCell className="py-3">{grade.maxMarks}</TableCell>
                      <TableCell className="py-3">{grade.grade}</TableCell>
                      <TableCell className="py-3">{grade.description}</TableCell>
                      <TableCell className="py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateClick(grade)}
                            className="hover:bg-gray-100"
                          >
                            <Edit2 className="h-4 w-4 text-custom-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(grade)}
                            className="hover:bg-gray-100"
                          >
                            <Trash2 className="h-4 w-4 text-custom-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update Modal */}
      <Sheet open={isUpdateModalOpen} onOpenChange={(open) => !open && handleUpdateClose()}>
        <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md">
          <SheetHeader>
            <SheetTitle>
              <VisuallyHidden>Update Grade</VisuallyHidden>
            </SheetTitle>
            <div className="flex flex-col items-start space-y-2">
              <div className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-custom-blue-600" />
                <h2 className="text-custom-blue-600 font-semibold text-xl">
                  Update Grade
                </h2>
              </div>
              <p className="text-sm">Update Existing Grade</p>
            </div>
          </SheetHeader>

          <div className="mt-6 mb-6">
            <hr className="flex-grow border-blue-600" />
          </div>

          <UpdateForm />
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && handleDeleteClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the grade.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GradeTable;