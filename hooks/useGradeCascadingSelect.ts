import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from '@/hooks/use-toast';

interface SelectOption {
  value: string;
  label: string;
}

export interface GradeFormValues {
  academicYear: string;
  branches: string[];
  classes: string[];

}

interface LoadingState {
  academicYears: boolean;
  branches: boolean;
  classes: boolean;
}

interface ErrorState {
  academicYears: string | null;
  branches: string | null;
  classes: string | null;
}

export function useGradeCascadingSelect(
  form: UseFormReturn<GradeFormValues>
) {
  const [academicYears, setAcademicYears] = useState<SelectOption[]>([]);
  const [branches, setBranches] = useState<SelectOption[]>([]);
  const [classes, setClasses] = useState<SelectOption[]>([]);
  
  const [isCastLoading, setCastIsLoading] = useState<LoadingState>({
    academicYears: false,
    branches: false,
    classes: false,
  });

  const [errors, setErrors] = useState<ErrorState>({
    academicYears: null,
    branches: null,
    classes: null,
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
  const resetFormValues = (fields: (keyof GradeFormValues)[]) => {
    fields.forEach(field => {
      if (Array.isArray(form.getValues(field))) {
        form.setValue(field, []);
      } else {
        form.setValue(field, "");
      }
    });
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
    resetFormValues(["branches", "classes"]);

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
    resetFormValues(["classes"]);

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
    form.setValue("classes", values);
  };

  return {
    academicYears,
    branches,
    classes,
    isCastLoading,
    errors,
    onAcademicYearChange,
    onBranchesChange,
    onClassesChange,
  };
}