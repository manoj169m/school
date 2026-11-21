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
import { Card } from "@/components/ui/card";
import { ExamCreationFormValues, ExamValidation } from "./types";

interface Subject {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

interface Class {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
}

interface ExamSubject {
  id: number;
  name: string;
  examDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxMarks: number;
  minMarks: number;
}

export interface Exam {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  branch: Branch;
  class: Class;
  section: Section;
  subjects: ExamSubject[];
}

interface ExamUpdateSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  examData: Exam | null;
  onExamUpdated: (updatedExam: ExamCreationFormValues) => Promise<void>;
}

// Helper function to format time string to "HH:mm"
const formatTimeToString = (timeStr: string): string => {
  // If timeStr is already in HH:mm format, return as is
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    return timeStr;
  }
  
  // If it's a date string, convert it
  try {
    const date = new Date(timeStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
};

// Helper function to calculate duration between two times
const calculateDuration = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  return endMinutes - startMinutes;
};

export function ExamUpdateSheetModal({
  isOpen,
  onClose,
  examData,
  onExamUpdated
}: ExamUpdateSheetModalProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  console.log(selectedSubjects);
  
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
  });

  const { handleSubmit, control, watch, setValue, reset } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });

  const numberOfSubjects = watch("numberOfSubjects");

  // Fetch subjects when modal opens
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!isOpen) return;
      try {
        const response = await fetch('/api/subjects');
        if (!response.ok) throw new Error('Failed to fetch subjects');
        const data = await response.json();
        setSubjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load subjects"
        });
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [isOpen, toast]);

  // Load exam data when available
  useEffect(() => {
    if (examData && isOpen) {
      const formattedSubjects = examData.subjects.map(subject => ({
        subjectId: subject.id.toString(),
        examDate: new Date(subject.examDate),
        startTime: subject.startTime, // Already in HH:mm format
        endTime: subject.endTime, // Already in HH:mm format
        duration: subject.duration,
        maxMarks: subject.maxMarks.toString(),
        minMarks: subject.minMarks.toString(),
      }));

      reset({
        examName: examData.name,
        numberOfSubjects: examData.subjects.length,
        startDate: new Date(examData.startDate),
        endDate: new Date(examData.endDate),
        branchId: [examData.branch.id],
        classId: [examData.class.id],
        sectionId: [examData.section.id],
        academicYearId: 1,
        subjects: formattedSubjects,
      });

      const newSelectedSubjects = new Set<string>();
      examData.subjects.forEach(subject => {
        newSelectedSubjects.add(subject.id.toString());
      });
      setSelectedSubjects(newSelectedSubjects);
    }
  }, [examData, isOpen, reset]);

  // Handle number of subjects change
  useEffect(() => {
    if (typeof numberOfSubjects === 'number') {
      const currentLength = fields.length;
      if (numberOfSubjects > currentLength) {
        for (let i = currentLength; i < numberOfSubjects; i++) {
          append({
            subjectId: "",
            startTime: "",
            endTime: "",
            duration: 0,
            maxMarks: "",
            minMarks: "",
            examDate: new Date(),
          });
        }
      } else if (numberOfSubjects < currentLength) {
        for (let i = currentLength - 1; i >= numberOfSubjects; i--) {
          remove(i);
        }
      }
    }
  }, [numberOfSubjects, fields.length, append, remove]);

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const currentField = methods.getValues(`subjects.${index}`);
    const otherField = field === 'startTime' ? 'endTime' : 'startTime';
    if (currentField[otherField]) {
      const duration = calculateDuration(
        field === 'startTime' ? value : currentField.startTime,
        field === 'endTime' ? value : currentField.endTime
      );
      if (duration > 0) {
        setValue(`subjects.${index}.duration`, duration);
      }
    }
  };

  const onSubmit: SubmitHandler<ExamCreationFormValues> = async (data) => {
    if (!examData?.id) return;
    setIsLoading(true);
    try {
      const formattedData = {
        exam: {
          ...data,
          startDate: new Date(data.startDate).toISOString().split('T')[0],
          endDate: new Date(data.endDate).toISOString().split('T')[0],
          subjects: data.subjects.map(subject => ({
            ...subject,
            examDate: new Date(subject.examDate).toISOString().split('T')[0],
            maxMarks: parseFloat(subject.maxMarks),
            minMarks: parseFloat(subject.minMarks),
            startTime: subject.startTime,
            endTime: subject.endTime,
            duration: subject.duration,
          }))
        }
      };

      const response = await fetch(`/api/exam/${examData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) throw new Error('Failed to update exam');
      const responseData = await response.json();
      await onExamUpdated(responseData);
      toast({
        title: "Success",
        description: "Exam updated successfully"
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update exam"
      });
    } finally {
      setIsLoading(false);
    }
    console.log(formatTimeToString);
  };

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent className="bg-white sheet-content mx-auto mr-5 my-4 p-6 max-w-xl max-h-[95vh] rounded-md overflow-auto" style={{ maxWidth: "60vw" }}>
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-custom-red-600">Update Exam</SheetTitle>
        </SheetHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card className="p-6">
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

              <div className="grid grid-cols-2 gap-4 mt-4">
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
            </Card>

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
                    {subjects.map((subject) => (
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

                <div className="grid grid-cols-3 gap-4 mt-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
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

            <div className="flex justify-end mt-6">
              <SubmitButton isLoading={isLoading}>
                Update Exam
              </SubmitButton>
            </div>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}