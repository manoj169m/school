import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "@/components/ui/SubmitButton";
import { useToast } from "@/hooks/use-toast";
import styles from "@/public/assets/styles/toast.module.css";
import { SquarePlus } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Card } from "@/components/ui/card";
import { ExamCreationFormValues, ExamValidation } from './types';

interface Subject {
  id: number;
  name: string;
}

interface ExamFormProps {
  isOpen: boolean;
  onClose: () => void;
  examFormData: {
    academicYear: string;
    branches: string[];
    classes: string[];
    sections: string[];
  } | null;
  onExamCreated?: (newExamData: ExamCreationFormValues) => Promise<void>;
}

export function ExamSheetModal({
  isOpen,
  onClose,
  examFormData,
  onExamCreated,
}: ExamFormProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<ExamCreationFormValues>({
    resolver: zodResolver(ExamValidation),
    defaultValues: {
      examName: "",
      numberOfSubjects: 0,
      startDate: new Date(),
      endDate: new Date(),
      branchId: [],
      classId: [],
      sectionId: [],
      academicYearId: 0,
      subjects: [],
    },
    mode: "all", // Enable validation on all events
  });

  const { handleSubmit, control, watch, setValue, formState: { errors, isDirty, isValid }, trigger } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });
 console.log(errors, isDirty, isValid);
  useEffect(() => {
    if (!isOpen) {
      methods.reset();
      setSelectedSubjects(new Set());
    } else if (examFormData) {
      methods.reset({
        examName: "",
        numberOfSubjects: 0,
        startDate: new Date(),
        endDate: new Date(),
        branchId: examFormData.branches.map(branch => parseInt(branch, 10)),
        classId: examFormData.classes.map(cls => parseInt(cls, 10)),
        sectionId: examFormData.sections.map(sec => parseInt(sec, 10)),
        academicYearId: parseInt(examFormData.academicYear, 10),
        subjects: [],
      });
    }
  }, [isOpen, examFormData, methods]);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!isOpen) return;

      try {
        setIsLoading(true);
        const response = await fetch('/api/subjects');
        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }
        const data = await response.json();
        setSubjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load subjects. Please try again.",
          className: styles.error,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [isOpen, toast]);

  // Watch subject changes and update selected subjects 
  const subjectFields = watch("subjects");
  useEffect(() => {
    if (subjectFields) {
      const newSelectedSubjects = new Set<string>();
      subjectFields.forEach(field => {
        if (field.subjectId) {
          newSelectedSubjects.add(field.subjectId);
        }
      });
      setSelectedSubjects(newSelectedSubjects);
    }
  }, [subjectFields]);

  const validateTimeRange = (startTime: string, endTime: string): boolean => {
    if (!startTime || !endTime) return false;
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    return (endHour * 60 + endMinute) > (startHour * 60 + startMinute);
  };

  const calculateDuration = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    return Math.max(0, (endHour * 60 + endMinute) - (startHour * 60 + startMinute));
  };

  const handleTimeChange = async (index: number, field: 'startTime' | 'endTime', value: string) => {
    const currentField = methods.getValues(`subjects.${index}`);
    const otherField = field === 'startTime' ? 'endTime' : 'startTime';
    
    if (currentField[otherField]) {
      const startTime = field === 'startTime' ? value : currentField.startTime;
      const endTime = field === 'endTime' ? value : currentField.endTime;
      
      if (validateTimeRange(startTime, endTime)) {
        const duration = calculateDuration(startTime, endTime);
        setValue(`subjects.${index}.duration`, duration);
      } else {
        setValue(`subjects.${index}.duration`, 0);
      }
      
      await trigger(`subjects.${index}`);
    }
  };

  const handleAddSubjects = async () => {
    const numberOfSubjects = methods.getValues("numberOfSubjects");
    
    if (numberOfSubjects > fields.length) {
      const subjectsToAdd = numberOfSubjects - fields.length;
      const newSubjects = Array.from({ length: subjectsToAdd }).map(() => ({
        subjectId: "",
        startTime: "",
        endTime: "",
        duration: 0,
        maxMarks: "",
        minMarks: "",
        examDate: new Date(),
      }));
      
      for (const subject of newSubjects) {
        append(subject);
      }
    } else if (numberOfSubjects < fields.length) {
      const subjectsToRemove = fields.length - numberOfSubjects;
      for (let i = 0; i < subjectsToRemove; i++) {
        remove(fields.length - 1);
      }
    }
    
    await trigger("subjects");
  };

  const onSubmit: SubmitHandler<ExamCreationFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        exam: {
          examName: data.examName,
          startDate: data.startDate.toISOString().split('T')[0],
          endDate: data.endDate.toISOString().split('T')[0],
          branchId: data.branchId,
          classId: data.classId,
          sectionId: data.sectionId,
          academicYearId: data.academicYearId,
          subjects: data.subjects.map(subject => ({
            subjectId: subject.subjectId,
            examDate: new Date(subject.examDate).toISOString().split('T')[0],
            startTime: subject.startTime,
            endTime: subject.endTime,
            duration: subject.duration,
            maxMarks: parseFloat(subject.maxMarks),
            minMarks: parseFloat(subject.minMarks),
          }))
        }
      };

      const response = await fetch("/api/exam", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create exam');
      }

      const responseData = await response.json();
      
      if (onExamCreated) {
        await onExamCreated(responseData.data);
      }

      toast({
        title: "Success",
        description: "Exam created successfully",
        className: styles.success,
      });

      methods.reset();
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create exam",
        className: styles.error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto" style={{ maxWidth: "60vw" }}>
        <SheetHeader>
          <SheetTitle>
            <VisuallyHidden>Add Exam</VisuallyHidden>
          </SheetTitle>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <h2 className="text-custom-red-600 font-semibold text-xl">Add Exam</h2>
            </div>
            <p className="text-sm text-gray-600">Create New Exam</p>
          </div>
        </SheetHeader>

        <div className="mt-6 mb-6">
          <hr className="border-red-600" />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-red-600"></div>
          </div>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={control}
                  name="examName"
                  label="Exam Name"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={control}
                  name="numberOfSubjects"
                  label="No of Subjects"
                  mandatory={true}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}  
                  control={control}
                  name="startDate"
                  label="Start Date"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={control}
                  name="endDate"
                  label="End Date"
                  mandatory={true}
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleAddSubjects}
                  disabled={!methods.getValues("numberOfSubjects")}
                  className="mt-5 mb-5 bg-white text-custom-red-600 hover:bg-custom-red-600 font-semibold hover:text-white border border-custom-red-600 px-10 py-2 rounded flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SquarePlus className="w-5 h-5" />
                  <span>Add Subject</span>
                </button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={control}
                      name={`subjects.${index}.subjectId`}
                      label={`Subject ${index + 1}`}
                      placeholder="Select subject"
                      mandatory={true}
                    >
                      {subjects
                        .filter(subject => !selectedSubjects.has(subject.id.toString()) || 
                                        subject.id.toString() === field.subjectId)
                        .map((subject) => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.name}
                          </SelectItem>
                        ))}
                    </CustomFormField>
                    <CustomFormField
                      fieldType={FormFieldType.DATE_PICKER}
                      control={control}
                      name={`subjects.${index}.examDate`}
                      label="Exam Date"
                      mandatory={true}
                    />
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4 mt-4">
                    <CustomFormField
                      fieldType={FormFieldType.TIME}
                      control={control}
                      name={`subjects.${index}.startTime`}
                      label="Start Time"
                      mandatory={true}
                      onChange={(value) => handleTimeChange(index, 'startTime', value)}
                    />
                    <CustomFormField
                      fieldType={FormFieldType.TIME}
                      control={control}
                      name={`subjects.${index}.endTime`}
                      label="End Time"
                      mandatory={true}
                      onChange={(value) => handleTimeChange(index, 'endTime', value)}
                    />
                    <CustomFormField
                      fieldType={FormFieldType.NUMBER}
                      control={control}  
                      name={`subjects.${index}.duration`}
                      label="Duration (minutes)"
                      disabled={true}
                      mandatory={true}
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={control}
                      name={`subjects.${index}.minMarks`}
                      label="Min Marks"
                      mandatory={true}
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT} 
                      control={control}
                      name={`subjects.${index}.maxMarks`}
                      label="Max Marks"
                      mandatory={true}
                    />
                  </div>
                </Card>
              ))}

              <div className="mt-6">
                <SubmitButton 
                  isLoading={isSubmitting}
                  //disabled={!isValid || isSubmitting}
                >
                  Create Exam
                </SubmitButton>
              </div>
            </form>
          </FormProvider>
        )}
      </SheetContent>
    </Sheet>
  );
}