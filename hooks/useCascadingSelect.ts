import { admissionSchema } from '@/lib/validation/admissionValidation';
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Define the interface for cascading options
interface CascadingOption {
  id: number;
  label?: string;
  name?: string;
}

// Type for form values based on your existing schema
type AdmissionFormValues = z.infer<typeof admissionSchema>;

export function useCascadingSelect(form: UseFormReturn<AdmissionFormValues>) {
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

  // Fetch Academic Years on initial load
  useEffect(() => {
    const fetchAcademicYears = async () => {
      setCastIsLoading(prev => ({ ...prev, academicYears: true, joinYears: true }));
      try {
        const response = await fetch('/api/models/cascading-selects');
        const data = await response.json();
        setAcademicYears(data);
        setJoinYears(data);
      } catch (error) {
        console.error('Failed to fetch academic years:', error);
      } finally {
        setCastIsLoading(prev => ({ ...prev, academicYears: false, joinYears: false }));
      }
    };
    fetchAcademicYears();
  }, []);

  // Fetch Branches when Academic Year is selected
  const fetchBranches = async (academicYearId: number) => {
    setCastIsLoading(prev => ({ ...prev, branches: true }));
    form.setValue('branch', '');
    form.setValue('class', '');
    form.setValue('section', '');
    
    try {
      const response = await fetch(`/api/models/cascading-selects?academicYearId=${academicYearId}`);
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setCastIsLoading(prev => ({ ...prev, branches: false }));
    }
  };

  // Fetch Classes when Branch is selected
  const fetchClasses = async (academicYearId: number, branchId: number) => {
    setCastIsLoading(prev => ({ ...prev, classes: true, classJoins: true }));
    form.setValue('class', '');
    form.setValue('section', '');
    
    try {
      const response = await fetch(`/api/models/cascading-selects?academicYearId=${academicYearId}&branchId=${branchId}`);
      const data = await response.json();
      setClasses(data);
      setClassJoins(data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setCastIsLoading(prev => ({ ...prev, classes: false, classJoins: false }));
    }
  };

  // Fetch Sections when Class is selected
  const fetchSections = async (academicYearId: number, branchId: number, classId: number) => {
    setCastIsLoading(prev => ({ ...prev, sections: true }));
    form.setValue('section', '');
    
    try {
      const response = await fetch(`/api/models/cascading-selects?academicYearId=${academicYearId}&branchId=${branchId}&classId=${classId}`);
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    } finally {
      setCastIsLoading(prev => ({ ...prev, sections: false }));
    }
  };

  // Handle Academic Year change
  const onAcademicYearChange = (value: string) => {
    const academicYearId = Number(value);
    form.setValue('academicYear', value);
    fetchBranches(academicYearId);
  };

  // Handle Branch change
  const onBranchChange = (value: string) => {
    const academicYearId = form.getValues('academicYear');
    const branchId = Number(value);
    form.setValue('branch', value);
    fetchClasses(Number(academicYearId), branchId);
  };

  // Handle Class change
  const onClassChange = (value: string) => {
    const academicYearId = form.getValues('academicYear');
    const branchId = form.getValues('branch');
    const classId = Number(value);
    form.setValue('class', value);
    fetchSections(Number(academicYearId), Number(branchId), classId);
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
    onClassChange
  };
}