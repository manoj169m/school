import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { StudentUpdateFormValues } from "@/lib/validation/studentUpdateValidation";

interface CascadingOption {
  id: number;
  label?: string;
  name?: string;
}

export function useCascadingSelectStudentUpdate(
  form: UseFormReturn<StudentUpdateFormValues>
) {
  const [academicYears, setAcademicYears] = useState<CascadingOption[]>([]);
  const [branches, setBranches] = useState<CascadingOption[]>([]);
  const [classes, setClasses] = useState<CascadingOption[]>([]);
  const [sections, setSections] = useState<CascadingOption[]>([]);
  const [joinYears, setJoinYears] = useState<CascadingOption[]>([]);
  const [classJoins, setClassJoins] = useState<CascadingOption[]>([]);
  const [isCastLoading, setCastIsLoading] = useState({
    academicYears: false,
    branches: false,
    classes: false,
    sections: false,
    joinYears: false,
    classJoins: false,
  });

  // Watch for form value changes
  const academicYear = form.watch("academicYear");
  const branch = form.watch("branch");
  const classValue = form.watch("class");

  // Initial data load
  useEffect(() => {
    const fetchAcademicYears = async () => {
      setCastIsLoading((prev) => ({
        ...prev,
        academicYears: true,
        joinYears: true,
      }));
      try {
        const response = await fetch("/api/models/cascading-selects");
        const data = await response.json();
        setAcademicYears(data);
        setJoinYears(data);
      } catch (error) {
        console.error("Failed to fetch academic years:", error);
      } finally {
        setCastIsLoading((prev) => ({
          ...prev,
          academicYears: false,
          joinYears: false,
        }));
      }
    };
    fetchAcademicYears();
  }, []);

  // Fetch branches when academic year changes
  useEffect(() => {
    if (!academicYear) return;

    const fetchBranches = async () => {
      setCastIsLoading((prev) => ({ ...prev, branches: true }));
      setBranches([]);
      setClasses([]);
      setSections([]);

      try {
        const response = await fetch(
          `/api/models/cascading-selects?academicYearId=${academicYear}`
        );
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      } finally {
        setCastIsLoading((prev) => ({ ...prev, branches: false }));
      }
    };

    fetchBranches();
  }, [academicYear]);

  // Fetch classes when branch changes
  useEffect(() => {
    if (!academicYear || !branch) return;

    const fetchClasses = async () => {
      setCastIsLoading((prev) => ({
        ...prev,
        classes: true,
        classJoins: true,
      }));
      setClasses([]);
      setSections([]);

      try {
        const response = await fetch(
          `/api/models/cascading-selects?academicYearId=${academicYear}&branchId=${branch}`
        );
        const data = await response.json();
        setClasses(data);
        setClassJoins(data);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setCastIsLoading((prev) => ({
          ...prev,
          classes: false,
          classJoins: false,
        }));
      }
    };

    fetchClasses();
  }, [academicYear, branch]);

  // Fetch sections when class changes
  useEffect(() => {
    if (!academicYear || !branch || !classValue) return;

    const fetchSections = async () => {
      setCastIsLoading((prev) => ({ ...prev, sections: true }));
      setSections([]);

      try {
        const response = await fetch(
          `/api/models/cascading-selects?academicYearId=${academicYear}&branchId=${branch}&classId=${classValue}`
        );
        const data = await response.json();
        setSections(data);
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      } finally {
        setCastIsLoading((prev) => ({ ...prev, sections: false }));
      }
    };

    fetchSections();
  }, [academicYear, branch, classValue]);

  const onAcademicYearChange = (value: string) => {
    form.setValue("academicYear", value);
    form.setValue("branch", "");
    form.setValue("class", "");
    form.setValue("section", "");
  };

  const onBranchChange = (value: string) => {
    form.setValue("branch", value);
    form.setValue("class", "");
    form.setValue("section", "");
  };

  const onClassChange = (value: string) => {
    form.setValue("class", value);
    form.setValue("section", "");
  };

  return {
    academicYears,
    branches,
    classes,
    sections,
    joinYears,
    classJoins,
    isCastLoading,
    onAcademicYearChange,
    onBranchChange,
    onClassChange,
  };
}
