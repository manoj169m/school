import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from '@/hooks/use-toast';

interface SelectOption {
  value: string;
  label: string;
  examIds?: number[];
}

export interface ResultFormValues {
  academicYear: string;
  branches: string[];
  classes: string[];
  sections: string[];
  exam: string;
  matchedExamIds?: number[]; // Added this field
}

interface LoadingState {
  academicYears: boolean;
  branches: boolean;
  classes: boolean;
  sections: boolean;
  exams: boolean;
}

interface ErrorState {
  academicYears: string | null;
  branches: string | null;
  classes: string | null;
  sections: string | null;
  exams: string | null;
}

interface ExamSubject {
  id: number;
  subjectId: number;
  maxMarks: number;
  minMarks: number;
  examDate: string;
  startTime: string;
  endTime: string;
  duration: number;
}

interface ExamWithSubjects {
  id: number;
  name: string;
  subjects: ExamSubject[];
}

export function useResultCascadingSelect(
  form: UseFormReturn<ResultFormValues>
) {
  const [academicYears, setAcademicYears] = useState<SelectOption[]>([]);
  const [branches, setBranches] = useState<SelectOption[]>([]);
  const [classes, setClasses] = useState<SelectOption[]>([]);
  const [sections, setSections] = useState<SelectOption[]>([]);
  const [exams, setExams] = useState<SelectOption[]>([]);
  
  const [isCastLoading, setCastIsLoading] = useState<LoadingState>({
    academicYears: false,
    branches: false,
    classes: false,
    sections: false,
    exams: false,
  });

  const [errors, setErrors] = useState<ErrorState>({
    academicYears: null,
    branches: null,
    classes: null,
    sections: null,
    exams: null,
  });

  // Helper function for API calls with error handling
  const fetchApi = async (url: string, errorMessage: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorMessage);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message,
        });
      }
      throw error;
    }
  };

  // Helper function to reset form values
  const resetFormValues = (fields: (keyof ResultFormValues)[]) => {
    fields.forEach(field => {
      form.setValue(field, Array.isArray(form.getValues(field)) ? [] : "");
    });
    // Also reset matchedExamIds when exam is reset
    if (fields.includes('exam')) {
      form.setValue('matchedExamIds', []);
    }
  };

  // Helper function to get subject signature for comparison
  const getSubjectSignature = (subjects: ExamSubject[]) => {
    return subjects
      .map(s => s.subjectId)
      .sort((a, b) => a - b)
      .join('|');
  };

  // Group and filter exams based on matching subject IDs
  const groupExams = (exams: ExamWithSubjects[]) => {
    // First, group exams by name
    const examGroups = new Map<string, ExamWithSubjects[]>();
    
    exams.forEach(exam => {
      if (!examGroups.has(exam.name)) {
        examGroups.set(exam.name, []);
      }
      examGroups.get(exam.name)?.push(exam);
    });

    // Filter and convert to SelectOptions
    return Array.from(examGroups.entries())
      .filter(([_, group]) => {
        // Get subject signature for each exam in the group
        const subjectSignatures = group.map(exam => getSubjectSignature(exam.subjects));
        
        // Check if all exams in this group have the same subjects
        const firstSignature = subjectSignatures[0];
        const allSameSubjects = subjectSignatures.every(sig => sig === firstSignature);
        
        // Check if we have an exam for each selected section
        const selectedSections = form.getValues("sections");
        const hasAllSections = group.length === selectedSections.length;
        
        // Additional check: verify we have exams for all selected class-section combinations
        const classesToCheck = form.getValues("classes");
        const sectionsToCheck = selectedSections;
        const requiredCombinations = classesToCheck.length * sectionsToCheck.length;
        
        return allSameSubjects && hasAllSections && group.length === requiredCombinations;
      })
      .map(([_, group]) => ({
        value: group[0].id.toString(),
        label: group[0].name,
        examIds: group.map(exam => exam.id)
      }));
  };

  // Fetch Academic Years
  useEffect(() => {
    const fetchAcademicYears = async () => {
      setCastIsLoading(prev => ({ ...prev, academicYears: true }));
      setErrors(prev => ({ ...prev, academicYears: null }));
      
      try {
        const data = await fetchApi(
          "/api/models/multi-selection",
          "Failed to fetch academic years"
        );
        setAcademicYears(data);
      } catch (error) {
        setErrors(prev => ({ ...prev, academicYears: "Failed to load academic years" }));
        setAcademicYears([]);
      } finally {
        setCastIsLoading(prev => ({ ...prev, academicYears: false }));
      }
    };

    fetchAcademicYears();
  }, []);

  // Fetch Branches
  const fetchBranches = async (academicYearId: string) => {
    setCastIsLoading(prev => ({ ...prev, branches: true }));
    setErrors(prev => ({ ...prev, branches: null }));
    resetFormValues(["branches", "classes", "sections", "exam"]);
    setExams([]);

    try {
      const data = await fetchApi(
        `/api/models/multi-selection?academicYearId=${academicYearId}`,
        "Failed to fetch branches"
      );
      setBranches(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, branches: "Failed to load branches" }));
      setBranches([]);
    } finally {
      setCastIsLoading(prev => ({ ...prev, branches: false }));
    }
  };

  // Fetch Classes
  const fetchClasses = async (academicYearId: string, branchIds: string[]) => {
    setCastIsLoading(prev => ({ ...prev, classes: true }));
    setErrors(prev => ({ ...prev, classes: null }));
    resetFormValues(["classes", "sections", "exam"]);
    setExams([]);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("academicYearId", academicYearId);
      branchIds.forEach(id => queryParams.append("branchIds", id));
      
      const data = await fetchApi(
        `/api/models/multi-selection?${queryParams.toString()}`,
        "Failed to fetch classes"
      );
      setClasses(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, classes: "Failed to load classes" }));
      setClasses([]);
    } finally {
      setCastIsLoading(prev => ({ ...prev, classes: false }));
    }
  };

  // Fetch Sections
  const fetchSections = async (
    academicYearId: string,
    branchIds: string[],
    classIds: string[]
  ) => {
    setCastIsLoading(prev => ({ ...prev, sections: true }));
    setErrors(prev => ({ ...prev, sections: null }));
    resetFormValues(["sections", "exam"]);
    setExams([]);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("academicYearId", academicYearId);
      branchIds.forEach(id => queryParams.append("branchIds", id));
      classIds.forEach(id => queryParams.append("classIds", id));

      const data = await fetchApi(
        `/api/models/multi-selection?${queryParams.toString()}`,
        "Failed to fetch sections"
      );
      setSections(data);
    } catch (error) {
      setErrors(prev => ({ ...prev, sections: "Failed to load sections" }));
      setSections([]);
    } finally {
      setCastIsLoading(prev => ({ ...prev, sections: false }));
    }
  };

  // Fetch Exams with retry mechanism and enhanced filtering
  const fetchExams = async (
    academicYearId: string,
    branchIds: string[],
    classIds: string[],
    sectionIds: string[]
  ) => {
    setCastIsLoading(prev => ({ ...prev, exams: true }));
    setErrors(prev => ({ ...prev, exams: null }));
    resetFormValues(["exam"]);

    const maxRetries = 3;
    let retryCount = 0;

    const attemptFetch = async (): Promise<SelectOption[]> => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("academicYearId", academicYearId);
        branchIds.forEach(id => queryParams.append("branchIds", id));
        classIds.forEach(id => queryParams.append("classIds", id));
        sectionIds.forEach(id => queryParams.append("sectionIds", id));

        const response = await fetch(`/api/exam/fetch?${queryParams.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch exams');
        }

        const data: ExamWithSubjects[] = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid exam data received');
        }

        // Apply the enhanced grouping and filtering
        return groupExams(data);
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          return attemptFetch();
        }
        throw error;
      }
    };

    try {
      const examData = await attemptFetch();
      setExams(examData);
    } catch (error) {
      setErrors(prev => ({ ...prev, exams: "Failed to load exams" }));
      setExams([]);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch exams. Please try again.',
      });
    } finally {
      setCastIsLoading(prev => ({ ...prev, exams: false }));
    }
  };

  // Change Handlers
  const onAcademicYearChange = (value: string) => {
    form.setValue("academicYear", value);
    if (value) {
      fetchBranches(value);
    }
  };

  const onBranchesChange = (values: string[]) => {
    const academicYearId = form.getValues("academicYear");
    form.setValue("branches", values);
    if (values.length > 0) {
      fetchClasses(academicYearId, values);
    }
  };

  const onClassesChange = (values: string[]) => {
    const academicYearId = form.getValues("academicYear");
    const branchIds = form.getValues("branches");
    form.setValue("classes", values);
    if (values.length > 0) {
      fetchSections(academicYearId, branchIds, values);
    }
  };

  const onSectionsChange = (values: string[]) => {
    const academicYearId = form.getValues("academicYear");
    const branchIds = form.getValues("branches");
    const classIds = form.getValues("classes");
    form.setValue("sections", values);
    if (values.length > 0) {
      fetchExams(academicYearId, branchIds, classIds, values);
    }
  };

  const onExamChange = (value: string) => {
    const selectedExam = exams.find(exam => exam.value === value);
    form.setValue("exam", value);
    form.setValue("matchedExamIds", selectedExam?.examIds || []);
  };

  return {
    academicYears,
    branches,
    classes,
    sections,
    exams,
    isCastLoading,
    errors,
    onAcademicYearChange,
    onBranchesChange,
    onClassesChange,
    onSectionsChange,
    onExamChange,
  };
}