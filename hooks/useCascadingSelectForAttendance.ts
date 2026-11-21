import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
}

export interface AttendanceFormValues {
  academicYear: string;
  branches: string[];
  classes: string[];
  sections: string[];
  date: Date;
}

export function useCascadingSelectForAttendance(
  form: UseFormReturn<AttendanceFormValues>
) {
  const [academicYears, setAcademicYears] = useState<SelectOption[]>([]);
  const [branches, setBranches] = useState<SelectOption[]>([]);
  const [classes, setClasses] = useState<SelectOption[]>([]);
  const [sections, setSections] = useState<SelectOption[]>([]);
  const [isCastLoading, setCastIsLoading] = useState({
    academicYears: false,
    branches: false,
    classes: false,
    sections: false,
  });

  // Fetch Academic Years on initial load
  useEffect(() => {
    const fetchAcademicYears = async () => {
      setCastIsLoading(prev => ({ ...prev, academicYears: true }));
      try {
        const response = await fetch("/api/models/multi-selection");
        const data = await response.json();
        setAcademicYears(data);
      } catch (error) {
        console.error("Failed to fetch academic years:", error);
      } finally {
        setCastIsLoading(prev => ({ ...prev, academicYears: false }));
      }
    };
    fetchAcademicYears();
  }, []);

  // Fetch Branches when Academic Year is selected
  const fetchBranches = async (academicYearId: string) => {
    setCastIsLoading(prev => ({ ...prev, branches: true }));
    form.setValue("branches", []);
    form.setValue("classes", []);
    form.setValue("sections", []);

    try {
      const response = await fetch(
        `/api/models/multi-selection?academicYearId=${academicYearId}`
      );
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    } finally {
      setCastIsLoading(prev => ({ ...prev, branches: false }));
    }
  };

  // Fetch Classes when Branches are selected
  const fetchClasses = async (academicYearId: string, branchIds: string[]) => {
    setCastIsLoading(prev => ({ ...prev, classes: true }));
    form.setValue("classes", []);
    form.setValue("sections", []);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("academicYearId", academicYearId);
      branchIds.forEach(id => queryParams.append("branchIds", id));
      
      const response = await fetch(
        `/api/models/multi-selection?${queryParams.toString()}`
      );
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setCastIsLoading(prev => ({ ...prev, classes: false }));
    }
  };

  // Fetch Sections when Classes are selected
  const fetchSections = async (
    academicYearId: string,
    branchIds: string[],
    classIds: string[]
  ) => {
    setCastIsLoading(prev => ({ ...prev, sections: true }));
    form.setValue("sections", []);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("academicYearId", academicYearId);
      branchIds.forEach(id => queryParams.append("branchIds", id));
      classIds.forEach(id => queryParams.append("classIds", id));

      const response = await fetch(
        `/api/models/multi-selection?${queryParams.toString()}`
      );
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    } finally {
      setCastIsLoading(prev => ({ ...prev, sections: false }));
    }
  };

  const onAcademicYearChange = (value: string) => {
    form.setValue("academicYear", value);
    fetchBranches(value);
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
    form.setValue("sections", values);
  };

  return {
    academicYears,
    branches,
    classes,
    sections,
    isCastLoading,
    onBranchesChange,
    onAcademicYearChange,
    onClassesChange,
    onSectionsChange,
  };
}