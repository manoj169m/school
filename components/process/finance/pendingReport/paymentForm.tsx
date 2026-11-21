'use client';

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { MultiSelectCombobox } from "@/components/ui/combobox";
import { z } from "zod";
import { useCascadingSelectForPayment } from "@/hooks/useCascadingSelectForPayment";
import PaymentPage from "./paymentTable";
import { Payment } from "./table/column";

const paymentFormSchema = z.object({
  academicYear: z.string().min(1, "Academic year is required"),
  branches: z.array(z.string()).min(1, "At least one branch is required"),
  classes: z.array(z.string()).min(1, "At least one class is required"),
  sections: z.array(z.string()).min(1, "At least one section is required"),
  accounts: z.array(z.string()).min(1, "At least one account is required"),
  terms: z.array(z.string()).min(1, "At least one term is required"),
  studentStatus: z.string().min(1, "Payment status is required"),
  transportUsing: z.boolean().optional(),
  hostelUsing: z.boolean().optional()
});

export interface PaymentFormValues {
  academicYear: string;
  branches: string[];
  classes: string[];
  sections: string[];
  accounts: string[];
  terms: string[];
  studentStatus: string;
  transportUsing?: boolean;
  hostelUsing?: boolean;
}

const PaymentForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);

  const methods = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      academicYear: "",
      branches: [],
      classes: [],
      sections: [],
      accounts: [],
      terms: [],
      studentStatus: "",
      transportUsing: false,
      hostelUsing: false,
    },
  });

  const {
    academicYears,
    branches,
    classes,
    sections,
    accounts,
    terms,
    isCastLoading,
    onBranchesChange,
    onAcademicYearChange,
    onClassesChange,
    onSectionsChange,
    onAccountsChange,
    onTermsChange,
  } = useCascadingSelectForPayment(methods);

  const { handleSubmit, watch, formState: { errors } } = methods;

  const selectedBranches = watch("branches");
  const selectedClasses = watch("classes");
  const selectedSections = watch("sections");
  const selectedAccounts = watch("accounts");
  const selectedTerms = watch("terms");

  const studentStatusOptions = [
    { value: "Active", label: "Active" },
    { value: "In-active", label: "In-active" }
  ];

  const handleSelectAllBranches = () => {
    const allBranchValues = branches.map(branch => branch.value);
    onBranchesChange(allBranchValues);
  };

  const handleSelectAllClasses = () => {
    const allClassValues = classes.map(class_ => class_.value);
    onClassesChange(allClassValues);
  };

  const handleSelectAllSections = () => {
    const allSectionValues = sections.map(section => section.value);
    onSectionsChange(allSectionValues);
  };

  const handleSelectAllAccounts = () => {
    const allAccountValues = accounts.map(account => account.value);
    onAccountsChange(allAccountValues);
  };

  const handleSelectAllTerms = () => {
    const allTermValues = terms.map(term => term.value);
    onTermsChange(allTermValues);
  };


  const handleFormSubmit = async (formData: PaymentFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      queryParams.append('academicYearId', formData.academicYear);
      formData.branches.forEach(branch => queryParams.append('branchIds', branch));
      formData.classes.forEach(class_ => queryParams.append('classIds', class_));
      formData.sections.forEach(section => queryParams.append('sectionIds', section));
      formData.accounts.forEach(account => queryParams.append('accountIds', account));
      formData.terms.forEach(term => queryParams.append('termIds', term));
      queryParams.append('paymentStatus', formData.studentStatus);

      // Add transport and hostel flags if applicable
      if (formData.transportUsing) {
        queryParams.append('transportUsing', 'true');
      }
      if (formData.hostelUsing) {
        queryParams.append('hostelUsing', 'true');
      }

      const response = await fetch(`/api/payments/pending?${queryParams.toString()}`);
    
      if (!response.ok) {
        throw new Error('Failed to fetch payment data');
      }

      const data = await response.json();
      setPayments(data);

      toast({
        title: "Success",
        description: `Found ${data.length} payments with ${formData.studentStatus.toLowerCase()} status`,
      });

    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to fetch payment data');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch payment data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCastLoading.academicYears) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-custom-pink-300" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Academic Year remains the same */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={methods.control}
            name="academicYear"
            label="Academic Year"
            placeholder="Select year"
            mandatory={true}
            onChange={(value) => onAcademicYearChange(value)}
          >
            {academicYears.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </CustomFormField>

          {/* Branches with Select All */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Branches<span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAllBranches}
                disabled={isCastLoading.branches || branches.length === 0}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Select All
              </Button>
            </div>
            <MultiSelectCombobox
              options={branches}
              value={selectedBranches}
              onChange={onBranchesChange}
              placeholder="Select branches..."
              searchPlaceholder="Search branches..."
              disabled={isCastLoading.branches || branches.length === 0}
            />
            {errors.branches && (
              <p className="text-sm text-red-500">{errors.branches.message}</p>
            )}
          </div>

          {/* Classes with Select All */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Classes<span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAllClasses}
                disabled={isCastLoading.classes || classes.length === 0}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Select All
              </Button>
            </div>
            <MultiSelectCombobox
              options={classes}
              value={selectedClasses}
              onChange={onClassesChange}
              placeholder="Select classes..."
              searchPlaceholder="Search classes..."
              disabled={isCastLoading.classes || classes.length === 0}
            />
            {errors.classes && (
              <p className="text-sm text-red-500">{errors.classes.message}</p>
            )}
          </div>

          {/* Sections with Select All */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Sections<span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAllSections}
                disabled={isCastLoading.sections || sections.length === 0}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Select All
              </Button>
            </div>
            <MultiSelectCombobox
              options={sections}
              value={selectedSections}
              onChange={onSectionsChange}
              placeholder="Select sections..."
              searchPlaceholder="Search sections..."
              disabled={isCastLoading.sections || sections.length === 0}
            />
            {errors.sections && (
              <p className="text-sm text-red-500">{errors.sections.message}</p>
            )}
          </div>

          {/* Accounts with Select All */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Accounts<span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAllAccounts}
                disabled={isCastLoading.accounts || accounts.length === 0}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Select All
              </Button>
            </div>
            <MultiSelectCombobox
              options={accounts}
              value={selectedAccounts}
              onChange={onAccountsChange}
              placeholder="Select accounts..."
              searchPlaceholder="Search accounts..."
              disabled={isCastLoading.accounts || accounts.length === 0}
            />
            {errors.accounts && (
              <p className="text-sm text-red-500">{errors.accounts.message}</p>
            )}
          </div>

          {/* Terms with Select All */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Terms<span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAllTerms}
                disabled={isCastLoading.terms || terms.length === 0}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Select All
              </Button>
            </div>
            <MultiSelectCombobox
              options={terms}
              value={selectedTerms}
              onChange={onTermsChange}
              placeholder="Select terms..."
              searchPlaceholder="Search terms..."
              disabled={isCastLoading.terms || terms.length === 0}
            />
            {errors.terms && (
              <p className="text-sm text-red-500">{errors.terms.message}</p>
            )}
          </div>

          {/* Student Status remains the same */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={methods.control}
            name="studentStatus"
            label="Student Status"
            placeholder="Select status"
            mandatory={true}
          >
            {studentStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </CustomFormField>
        </div>

        {/* Rest of the form remains the same */}
        <div className="flex justify-center mt-8">
          <Button
            className="bg-custom-pink-300 text-white px-4 py-2 rounded hover:bg-custom-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>

        {error && (
          <div className="text-red-500 text-center mt-4">{error}</div>
        )}
      </form>
    </FormProvider>

    {payments.length > 0 && (
      <div className="mt-8">
        <PaymentPage data={payments} />
      </div>
    )}
  </div>
  );
};

export default PaymentForm;