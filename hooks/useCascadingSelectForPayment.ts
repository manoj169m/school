// useCascadingSelectForPayment.ts
import { PaymentFormValues } from "@/components/process/finance/pendingReport/paymentForm";
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
  applicableFor?: 'TRANSPORT' | 'HOSTEL' | 'NONE';
}

interface Account {
  id: number;
  accountName: string;
  accountType: 'INCOME' | 'EXPENSE';
  applicableFor: 'TRANSPORT' | 'HOSTEL' | 'NONE';
}

export function useCascadingSelectForPayment(
  form: UseFormReturn<PaymentFormValues>
) {
  const [academicYears, setAcademicYears] = useState<SelectOption[]>([]);
  const [branches, setBranches] = useState<SelectOption[]>([]);
  const [classes, setClasses] = useState<SelectOption[]>([]);
  const [sections, setSections] = useState<SelectOption[]>([]);
  const [accounts, setAccounts] = useState<SelectOption[]>([]);
  const [terms, setTerms] = useState<SelectOption[]>([]);
  
  const [isCastLoading, setCastIsLoading] = useState({
    academicYears: false,
    branches: false,
    classes: false,
    sections: false,
    accounts: false,
    terms: false,
  });

  // Helper function to reset form values
  const resetFormValues = (fields: (keyof PaymentFormValues)[]) => {
    fields.forEach(field => {
      form.setValue(field, Array.isArray(form.getValues(field)) ? [] : "");
    });
  };

  // Initialize terms
  useEffect(() => {
    const terms: SelectOption[] = Array.from({ length: 4 }, (_, i) => ({
      value: String(i + 1),
      label: `Term - ${i + 1}`
    }));
    setTerms(terms);
  }, []);

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
    resetFormValues(["branches", "classes", "sections", "accounts"]);

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
    resetFormValues(["classes", "sections", "accounts"]);

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
    resetFormValues(["sections", "accounts"]);

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

  // Fetch Accounts with filtering
  const fetchAccounts = async (
    academicYearId: string,
    branchIds: string[],
    classIds: string[],
    sectionIds: string[]
  ) => {
    setCastIsLoading(prev => ({ ...prev, accounts: true }));
    resetFormValues(["accounts"]);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("academicYearId", academicYearId);
      branchIds.forEach(id => queryParams.append("branchIds", id));
      classIds.forEach(id => queryParams.append("classIds", id));
      sectionIds.forEach(id => queryParams.append("sectionIds", id));

      const response = await fetch(
        `/api/accounts?${queryParams.toString()}`
      );
      const data: Account[] = await response.json();
      
      // Filter accounts to show only INCOME type with specific applicableFor values
      const filteredAccounts = data.filter(account => 
        account.accountType === 'INCOME' && 
        ['TRANSPORT', 'HOSTEL', 'NONE'].includes(account.applicableFor)
      );
      
      // Transform account data to SelectOption format with applicableFor metadata
      const accountOptions = filteredAccounts.map(account => ({
        value: account.id.toString(),
        label: account.accountName,
        applicableFor: account.applicableFor
      }));
      
      setAccounts(accountOptions);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setCastIsLoading(prev => ({ ...prev, accounts: false }));
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
      fetchAccounts(academicYearId, branchIds, classIds, values);
    }
  };

  const onAccountsChange = (values: string[]) => {
    form.setValue("accounts", values);
    
    // Check for transport and hostel accounts
    const selectedAccountsDetails = accounts.filter(acc => 
      values.includes(acc.value)
    );

    const hasTransport = selectedAccountsDetails.some(
      acc => acc.applicableFor === 'TRANSPORT'
    );
    const hasHostel = selectedAccountsDetails.some(
      acc => acc.applicableFor === 'HOSTEL'
    );

    // Update the form with transport and hostel usage
    form.setValue("transportUsing", hasTransport);
    form.setValue("hostelUsing", hasHostel);
  };

  const onTermsChange = (values: string[]) => {
    form.setValue("terms", values);
  };

  return {
    academicYears,
    branches,
    classes,
    sections,
    accounts,
    terms,
    isCastLoading,
    onAcademicYearChange,
    onBranchesChange,
    onClassesChange,
    onSectionsChange,
    onAccountsChange,
    onTermsChange,
  };
}