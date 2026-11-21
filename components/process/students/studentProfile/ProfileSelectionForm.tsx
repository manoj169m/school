import React, { useEffect, useState, useCallback } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import SearchSelect from "@/components/ui/searchSelect";
import { fetchWithRetry, getErrorMessage } from "@/utils/apiUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LinkButtonRender from "./LinkButtonRender";

interface AcademicYearOption {
  id: number;
  label: string;
  isCurrentYear: boolean;
}

interface BranchOption {
  id: number;
  name: string;
  acronym: string;
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
    branchId: number;
  };
}

interface FormValues {
  academicYearId: string;
  branchId: string;
  status: string;
  enrollmentId: string;
}

function StudentProfileSelectionForm() {
  const [academicYear, setAcademicYear] = useState<AcademicYearOption[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const methods = useForm<FormValues>({
    defaultValues: {
      academicYearId: "",
      branchId: "all",
      status: "Active",
      enrollmentId: "",
    },
  });

  const { watch, control, setValue } = methods;
  const academicYearId = watch("academicYearId");
  const branchId = watch("branchId");
  const status = watch("status");
  const selectedEnrollmentId = watch("enrollmentId");

  const fetchAcademicYear = useCallback(async () => {
    try {
      const data = await fetchWithRetry<AcademicYearOption[]>(
        "/api/academicYears"
      );
      setAcademicYear(data);
      const currentYear = data.find((year) => year.isCurrentYear);
      if (currentYear) {
        setValue("academicYearId", currentYear.id.toString());
      }
      setError("");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }, [setValue]);

  const fetchBranches = useCallback(async () => {
    try {
      const data = await fetchWithRetry<BranchOption[]>("/api/branches");
      setBranches(data);
      setError("");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    if (!academicYearId || !status) {
      setStudents([]);
      return;
    }

    setIsLoadingStudents(true);
    try {
      const data = await fetchWithRetry<StudentOption[]>(
        "/api/studentsSelect/student-branch",
        {
          params: {
            academicYearId,
            status,
            branchId: branchId === "all" ? "all" : branchId,
          },
        }
      );
      setStudents(data);
      setError("");
    } catch (error) {
      setError(getErrorMessage(error));
      setStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  }, [academicYearId, status, branchId]);

  useEffect(() => {
    fetchAcademicYear();
    fetchBranches();
  }, [fetchAcademicYear, fetchBranches]);

  useEffect(() => {
    fetchStudents();
  }, [branchId, academicYearId, status, fetchStudents]);

  // Modified handleStudentSelect to update form and state correctly
  const handleStudentSelect = (enrollmentId: string | undefined) => {
    setValue("enrollmentId", enrollmentId || "");
    setShowUpdateForm(!!enrollmentId);
    console.log(showUpdateForm);
  };

  const handleRetry = () => {
    setError("");
    fetchStudents();
  };

  return (
    <div className="space-y-6">
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
                    fieldType={FormFieldType.DEFAULTSELECT}
                    control={control}
                    name="branchId"
                    label="Branch"
                    mandatory={true}
                  >
                    <SelectItem value="all">All Branches</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.acronym}
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
                        value={students.find(
                          (student) => student.value === field.value
                        )}
                        onChange={(option) => {
                          const enrollmentId = option?.value;
                          handleStudentSelect(enrollmentId);
                        }}
                        getOptionLabel={(option) =>
                          `${option.label} - ${option.details.class} ${option.details.section}`
                        }
                        getOptionValue={(option) => option.value}
                        renderOption={(option) => (
                          <div>
                            <div className="font-medium flex">
                              {option.label} - Class: {option.details.class}{" "}
                              Sec: {option.details.section}
                            </div>
                            <div className="text-sm text-gray-500">
                              Father: {option.details.fatherName} | Ph:{" "}
                              {option.details.phoneNo}
                            </div>
                          </div>
                        )}
                        placeholder={
                          isLoadingStudents
                            ? "Loading students..."
                            : "Search students..."
                        }
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

      {selectedEnrollmentId && (
        <LinkButtonRender enrollmentId={selectedEnrollmentId} />
      )}
    </div>
  );
}

export default StudentProfileSelectionForm;
