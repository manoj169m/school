import { FeeCategory } from "@/components/master/financeMaster/feeByClass/types";
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
}

export interface FeeCategoryFormValues {
  academicYear: string;
  branches: string[];
  classes: string[];
  sections: string[];
  feeCategories: string[];
}

export function useCascadingSelectForFeeCategory(
  form: UseFormReturn<FeeCategoryFormValues>
) {
  const [academicYears, setAcademicYears] = useState<SelectOption[]>([]);
  const [branches, setBranches] = useState<SelectOption[]>([]);
  const [classes, setClasses] = useState<SelectOption[]>([]);
  const [sections, setSections] = useState<SelectOption[]>([]);
  const [feeCategories, setFeeCategories] = useState<SelectOption[]>([]);
  
  const [isCastLoading, setCastIsLoading] = useState({
    academicYears: false,
    branches: false,
    classes: false,
    sections: false,
    feeCategories: false,
  });

  // Helper function to reset form values
  const resetFormValues = (fields: (keyof FeeCategoryFormValues)[]) => {
    fields.forEach(field => {
      form.setValue(field, Array.isArray(form.getValues(field)) ? [] : "");
    });
  };

  // Fetch Academic Years
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

  // Fetch Branches
  const fetchBranches = async (academicYearId: string) => {
    setCastIsLoading(prev => ({ ...prev, branches: true }));
    resetFormValues(["branches", "classes", "sections", "feeCategories"]);

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

  // Fetch Classes
  const fetchClasses = async (academicYearId: string, branchIds: string[]) => {
    setCastIsLoading(prev => ({ ...prev, classes: true }));
    resetFormValues(["classes", "sections", "feeCategories"]);

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

  // Fetch Sections
  const fetchSections = async (
    academicYearId: string,
    branchIds: string[],
    classIds: string[]
  ) => {
    setCastIsLoading(prev => ({ ...prev, sections: true }));
    resetFormValues(["sections", "feeCategories"]);

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

  // Fetch Fee Categories
  const fetchFeeCategories = async (
    academicYearId: string,
    branchIds: string[],
    classIds: string[],
    sectionIds: string[]
  ) => {
    setCastIsLoading(prev => ({ ...prev, feeCategories: true }));
    resetFormValues(["feeCategories"]);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("academicYearId", academicYearId);
      branchIds.forEach(id => queryParams.append("branchIds", id));
      classIds.forEach(id => queryParams.append("classIds", id));
      sectionIds.forEach(id => queryParams.append("sectionIds", id));

      const response = await fetch(`/api/feeCategory?${queryParams.toString()}`);
      const data = await response.json();
      
      // Transform fee category data to SelectOption format
      const feeCategoryOptions = data.map((category: FeeCategory) => ({
        value: category.id.toString(),
        label: category.category
      }));
      
      setFeeCategories(feeCategoryOptions);
    } catch (error) {
      console.error("Failed to fetch fee categories:", error);
    } finally {
      setCastIsLoading(prev => ({ ...prev, feeCategories: false }));
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
      fetchFeeCategories(academicYearId, branchIds, classIds, values);
    }
  };

  const onFeeCategoriesChange = (values: string[]) => {
    form.setValue("feeCategories", values);
  };

  return {
    academicYears,
    branches,
    classes,
    sections,
    feeCategories,
    isCastLoading,
    onAcademicYearChange,
    onBranchesChange,
    onClassesChange,
    onSectionsChange,
    onFeeCategoriesChange,
  };
}