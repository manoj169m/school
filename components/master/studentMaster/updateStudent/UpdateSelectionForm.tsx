import React, { useEffect, useState, useCallback } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import SearchSelect from "@/components/ui/searchSelect";
import { fetchWithRetry, getErrorMessage } from "@/utils/apiUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import UpdateAdmissionHeaderAndLinks from "./studentUpdateForm";

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

interface Student {
  id: number;
  firstName: string;
  lastName?: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string | Date;
  community?: string;
  caste?: string;
  bloodGroup?: string;
  motherTongue?: string;
  religion?: string;
  aadharNo?: string;
  emisNo?: string;
  placeOfBirth?: string;
  country: string;
  state: string;
  cityTownVillage: string;
  address: string;
  communicationNo: string;
  phoneNo: string;
  email: string;
  relationName1: string;
  relationType1: string;
  relationNo1: string;
  relationName2?: string;
  relationType2?: string;
  relationNo2?: string;
  admissionNo: string;
  applicationNo?: string;
  rollNo: string;
}

interface CurrentEnrollment {
  enrollmentDate: string | Date;
  academicYearId: number;
  branchId: number;
  classId: number;
  sectionId: number;
  feeCategoryId: number;
  transportStatus: string;
  hostelStatus: string;
  joinYear: string;
  classJoin: string;
  admissionNo: string;
  applicationNo?: string;
  rollNo: string;
  status?: string;
}

interface TransportAssignment {
  routeId: number;
  stopId: number;
  academicYearId: number;
  route?: { routeName: string };
  stop?: { stopName: string };
}

interface TransportDetails {
  transportAssignment: TransportAssignment | null;
}

interface HostelAssignment {
  hostelId: number;
  roomId: number;
  hostel: { hostelName: string };
  room: { floorNumber: string; roomNumber: string };
}

interface HostelDetails {
  hostelAssignment: HostelAssignment | null;
}

interface StudentData {
  student: Student;
  currentEnrollment: CurrentEnrollment;
  transportDetails?: TransportDetails;
  hostelDetails?: HostelDetails;
  studentFee: {
    totalFee: number;
    individualFee: number;
    finalFee: number;
    balanceAmount: number;
  };
}


interface FormValues {
  academicYearId: string;
  branchId: string;
  status: string;
  enrollmentId: string;
}

function StudentUpdate() {
  const [academicYear, setAcademicYear] = useState<AcademicYearOption[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoadingStudent, setIsLoadingStudent] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const methods = useForm<FormValues>({
    defaultValues: {
      academicYearId: "",
      branchId: "all", // Set default to "all"
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
      setBranches(data); // Store only the actual branches from backend
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
        `/api/studentsSelect/student-branch`,
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

  const fetchStudentData = async (enrollmentId: string) => {
    setIsLoadingStudent(true);
    try {
      const data: StudentData = await fetchWithRetry(
        `/api/students/${enrollmentId}`
      );
      setStudentData(data);
      setShowUpdateForm(true);
      setError("");
    } catch (error) {
      setError(getErrorMessage(error));
      setStudentData(null);
      setShowUpdateForm(false);
    } finally {
      setIsLoadingStudent(false);
    }
  };

  useEffect(() => {
    fetchAcademicYear();
    fetchBranches();
  }, [fetchAcademicYear, fetchBranches]);

  useEffect(() => {
    fetchStudents();
    setValue("enrollmentId", "");
    setShowUpdateForm(false);
  }, [branchId, academicYearId, status, fetchStudents, setValue]);

  useEffect(() => {
    if (selectedEnrollmentId) {
      fetchStudentData(selectedEnrollmentId);
    }
  }, [selectedEnrollmentId]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => {
                  setError("");
                  fetchStudents();
                }}
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

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={control}
                  name="status"
                  label="Status"
                  mandatory={true}
                >
                  {["Active", "Inactive"].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <div className="col-span-1">
                  <Controller
                    name="enrollmentId"
                    control={control}
                    render={({ field }) => (
                      <SearchSelect
                        options={students}
                        value={students.find(
                          (student) => student.value === field.value
                        )}
                        onChange={(option) => field.onChange(option?.value)}
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
      {isLoadingStudent && <p>Loading student data...</p>}
      {showUpdateForm && studentData && (
        <UpdateAdmissionHeaderAndLinks studentData={studentData} />
      )}
    </div>
  );
}

export default StudentUpdate;
