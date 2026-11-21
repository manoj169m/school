'use client';
import React, { useEffect, useState, useCallback } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import OverAllPage from "./OverAllPage";
import SearchSelect from "@/components/ui/searchSelect";
import { FeeData } from "@/types/income";
import { fetchWithRetry, getErrorMessage } from "@/utils/apiUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AcademicYearOption {
  id: number;
  label: string;
  isCurrentYear: boolean;
}

interface StudentOption {
  value: string;
  label: string;
  details: {
    class: string;
    section: string;
    fatherName: string;
    communicationNo: string;
    phoneNo: string;
  };
}

interface FormValues {
  academicYearId: string;
  status: string;
  enrollmentId: string;
}

function SelectIncomeCollection() {
  const [academicYear, setAcademicYear] = useState<AcademicYearOption[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [feeData, setFeeData] = useState<FeeData | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoadingFees, setIsLoadingFees] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const methods = useForm<FormValues>({
    defaultValues: {
      academicYearId: "",
      status: "Active",
      enrollmentId: "",
    },
  });

  const { watch, control, setValue } = methods;
  const academicYearId = watch("academicYearId");
  const status = watch("status");
  const selectedEnrollmentId = watch("enrollmentId");

  const fetchAcademicYear = useCallback(async () => {
    try {
      const data = await fetchWithRetry<AcademicYearOption[]>("/api/academicYears");
      setAcademicYear(data);
      
      const currentYear = data.find(year => year.isCurrentYear);
      if (currentYear) {
        setValue("academicYearId", currentYear.id.toString());
      }
      
      setError("");
    } catch (error) {
      setError(getErrorMessage(error));
      console.error("Error fetching academic years:", error);
    }
  }, [setValue]);

  const fetchStudents = useCallback(async () => {
    if (!academicYearId || !status) return;
    
    setIsLoadingStudents(true);
    try {
      const data = await fetchWithRetry<StudentOption[]>(`/api/studentsSelect`, {
        params: { academicYearId, status }
      });
      setStudents(data);
      setError("");
    } catch (error) {
      setError(getErrorMessage(error));
      console.error("Error fetching students:", error);
    } finally {
      setIsLoadingStudents(false);
    }
  }, [academicYearId, status]);

  const fetchStudentFees = useCallback(async () => {
    if (!selectedEnrollmentId) return;
    
    setIsLoadingFees(true);
    try {
      const data = await fetchWithRetry<FeeData>(
        `/api/studentFees/${selectedEnrollmentId}`,
        { retries: 2 }
      );
      setFeeData(data);
      setError("");
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      setError(getErrorMessage(error));
      setFeeData(null);
      
      // Implement retry logic for timeout errors
      if (retryCount < 2 && getErrorMessage(error).includes('timeout')) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchStudentFees(), 2000); // Retry after 2 seconds
      }
    } finally {
      setIsLoadingFees(false);
    }
  }, [selectedEnrollmentId, retryCount]);

  useEffect(() => {
    fetchAcademicYear();
  }, [fetchAcademicYear]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    fetchStudentFees();
  }, [fetchStudentFees]);

  const handleRetry = () => {
    setError("");
    setRetryCount(0);
    if (selectedEnrollmentId) {
      fetchStudentFees();
    }
  };

  return (
    <div>
      <div className="p-6 bg-white shadow-lg rounded-lg">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={handleRetry}
                className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded-md transition-colors"
              >
                Retry
              </button>
            </AlertDescription>
          </Alert>
        )}
        
        <FormProvider {...methods}>
          <form>
            <section>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div className="col-span-1 md:col-span-1">
                  <CustomFormField
                    fieldType={FormFieldType.DEFAULTSELECT}
                    control={control}
                    name="academicYearId"
                    label="Academic Year"
                    mandatory={true}
                  >
                    {academicYear.map((year) => (
                      <SelectItem key={year.id} value={year.id.toString()}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </CustomFormField>
                </div>
                <div className="col-span-1 md:col-span-1">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={control}
                    name="status"
                    label="Status"
                    mandatory={true}
                  >
                    {['Active', 'Inactive'].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </CustomFormField>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Controller
                    name="enrollmentId"
                    control={control}
                    render={({ field }) => (
                      <SearchSelect
                        options={students}
                        value={students.find(student => student.value === field.value)}
                        onChange={(option) => field.onChange(option?.value)}
                        getOptionLabel={(option) =>
                          `${option.label} - ${option.details.class} ${option.details.section}`
                        }
                        getOptionValue={(option) => option.value}
                        renderOption={(option) => (
                          <div>
                            <div className="font-medium flex">
                              {option.label} - Class: {option.details.class} Sec: {option.details.section}
                            </div>
                            <div className="text-sm text-gray-500">
                              Father: {option.details.fatherName} | Ph: {option.details.phoneNo}
                            </div>
                          </div>
                        )}
                        placeholder={isLoadingStudents ? "Loading students..." : "Search students..."}
                        label="Students"
                        required={true}
                        className="w-full"
                        disabled={isLoadingStudents}
                      />
                    )}
                  />
                </div>
              </div>
            </section>
          </form>
        </FormProvider>
      </div>

      {isLoadingFees ? (
        <div className="mt-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading fee details...</p>
        </div>
      ) : (
        feeData && <OverAllPage feeData={feeData} />
      )}
    </div>
  );
}

export default SelectIncomeCollection;