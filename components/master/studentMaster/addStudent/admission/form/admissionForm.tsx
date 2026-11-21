"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  GenderTypes,
  StateTypes,
  BloodGroupTypes,
  CountryTypes,
  HostelTypes,
  TransportTypes,
  FeeCategory,
} from "@/constant/data";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import { CheckCircle, XCircle } from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import SubmitButton from "@/components/ui/SubmitButton";
import { admissionSchema } from "@/lib/validation/admissionValidation";
import { z } from "zod";
import { useCascadingSelect } from "@/hooks/useCascadingSelect";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import styles from "@/public/assets/styles/toast.module.css";
import useTransportHostelForm from "@/hooks/UsingNotUsing";

type ValidationError = {
  path: (string | number)[];
  message: string;
};

type AdmissionFormValues = z.infer<typeof admissionSchema>;

const fieldGroups = {
  personalInfo: [
    "firstName",
    "lastName",
    "gender",
    "dateOfBirth",
    "country",
    "state",
    "cityTownVillage",
    "address",
  ],
  communication: ["communicationNo", "phoneNo", "email"],
  familyInfo: ["relationName1", "relationType1", "relationNo1"],
  academicInfo: [
    "academicYear",
    "branch",
    "joinYear",
    "dateOfJoin",

    "classJoin",

    "class",
    "section",
    "admissionNo",
    "rollNo",
  ],
  financeInfo: ["feeCategory"],
  transportInfo: ["transport"],
  hostelInfo: ["hostel"],
} as const;

const AdmissionForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [feeCategories, setFeeCategories] = useState<FeeCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      dateOfBirth: new Date(),
      community: "",
      caste: "",
      bloodGroup: "",
      motherTongue: "",
      religion: "",
      aadharNo: "",
      emisNo: "",
      placeOfBirth: "",
      country: "",
      state: "",
      cityTownVillage: "",
      address: "",

      communicationNo: "",
      phoneNo: "",
      email: "",

      relationName1: "",
      relationType1: "",
      relationNo1: "",
      relationName2: "",
      relationType2: "",
      relationNo2: "",

      academicYear: "",
      branch: "",
      joinYear: "",
      dateOfJoin: new Date(),
      classJoin: "",
      class: "",
      section: "",
      admissionNo: "",
      applicationNo: "",
      rollNo: "",

      feeCategory: "",

      transport: "",
      routeName: "",
      stopName: "",

      hostel: "",
      hostelName: "",
      floorName: "",
    },
  });
  console.log(error);

  // Keep this
  const {
    routes,
    stops,
    hostels,
    rooms,
    selectedTransport,
    selectedRoute,
    selectedHostel,
    handleTransportAcademicYearChange, // Getting it from hook
    handleTransportChange,
    handleRouteChange,
    handleHostelChange,
    handleHostelNameChange,
  } = useTransportHostelForm();

  const {
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
  } = useCascadingSelect(form);

  const [validationStates, setValidationStates] = useState({
    personalInfo: false,
    communication: false,
    familyInfo: false,
    academicInfo: false,
    financeInfo: false,
    transportInfo: false,
    hostelInfo: false,
  });

  useEffect(() => {
    async function fetchFeeCategories() {
      try {
        const response = await fetch("/api/feeCategory");
        if (!response.ok) {
          throw new Error("Failed to fetch fee categories");
        }
        const result = await response.json();
        setFeeCategories(result); // Ensure your API response matches the FeeCategory type
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
          className: styles.error,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeeCategories();
  }, []);

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof AdmissionFormValues)[]
      ): boolean => {
        return fields.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          } else if (value instanceof Date) {
            return !isNaN(value.getTime()); // Check if the Date is valid
          }
          return false; // Default to false if the value is neither string nor Date
        });
      };

      setValidationStates({
        personalInfo: checkFieldGroupValidity(fieldGroups.personalInfo),
        communication: checkFieldGroupValidity(fieldGroups.communication),
        familyInfo: checkFieldGroupValidity(fieldGroups.familyInfo),
        academicInfo: checkFieldGroupValidity(fieldGroups.academicInfo),
        financeInfo: checkFieldGroupValidity(fieldGroups.financeInfo),
        transportInfo: checkFieldGroupValidity(fieldGroups.transportInfo),
        hostelInfo: checkFieldGroupValidity(fieldGroups.hostelInfo),
      });
    });

    return () => subscription.unsubscribe();
  }, [form]); // Add `form` as a dependency

  const onSubmit = async (values: AdmissionFormValues) => {
    setIsLoading(true);
    try {
      console.log("Submitting Form Data:", values);

      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "Validation Failed") {
          const errorDetails = (result.details as ValidationError[])
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join("\n");
          throw new Error(`Validation Error:\n${errorDetails}`);
        }
        throw new Error(result.error || "Failed to register student");
      }

      // Format currency values
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount);
      };

      // Show success toast with API response data
      toast({
        title: "✅ " + result.message,
        description: (
          <div className="mt-2 space-y-2 text-sm">
            <p>
              <strong>Student ID:</strong> {result.data.studentId}
            </p>
            <p>
              <strong>Enrollment ID:</strong> {result.data.enrollmentId}
            </p>
            <p className="font-semibold mt-2">Fee Details:</p>
            <p>
              <strong>Total Fee:</strong>{" "}
              {formatCurrency(result.data.fees.totalFee)}
            </p>
            <p>
              <strong>Individual Fee:</strong>{" "}
              {formatCurrency(result.data.fees.individualFee)}
            </p>
            <p>
              <strong>Final Fee:</strong>{" "}
              {formatCurrency(result.data.fees.finalFee)}
            </p>
            <p>
              <strong>Balance Amount:</strong>{" "}
              {formatCurrency(result.data.fees.balanceAmount)}
            </p>
          </div>
        ),
        className: `${styles.success} max-w-md`,
        duration: 5000, // Show for 5 seconds due to more content
      });

      // Reset form after successful submission
      form.reset();
    } catch (error) {
      console.error("Student Registration Error:", error);

      toast({
        variant: "destructive",
        title: "😥 Registration Failed",
        description:
          error instanceof Error ? error.message : "Failed to register student",
        className: styles.error,
        action: (
          <ToastAction altText="Try again" onClick={() => onSubmit(values)}>
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Form {...form}>
        <div className="flex justify-between w-full mt-3">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white shadow-lg rounded-lg p-6 space-y-8 w-full"
          >
            <section className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4 p-0 md:p-3 md:border-r border-red-600">
                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Personal Information
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.personalInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the personal details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="firstName"
                  placeholder="Enter your name"
                  label="Name"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="lastName"
                  placeholder="Enter student sur name"
                  label="Last Name"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.RADIO}
                  control={form.control}
                  name="gender"
                  label="Gender"
                  mandatory={true}
                  options={GenderTypes}
                />
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="dateOfBirth"
                  label="Date of Birth"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="community"
                  placeholder="Enter community"
                  label="Community"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="caste"
                  placeholder="Enter caste"
                  label="Caste"
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="bloodGroup"
                  label="Blood Group"
                  placeholder="Select Blood Group"
                >
                  {BloodGroupTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="motherTongue"
                  placeholder="Mother tongue"
                  label="Mother Tongue"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="religion"
                  placeholder="Enter Religion"
                  label="Religion"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="aadharNo"
                  placeholder="xxxx xxxx xxxx"
                  label="Aadhar No"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="emisNo"
                  placeholder="xxxx"
                  label="Emis No"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="placeOfBirth"
                  placeholder="Enter"
                  label="Place Of Birth"
                />

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="country"
                  label="Country"
                  placeholder="Select country"
                  mandatory={true}
                >
                  {CountryTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="state"
                  label="State"
                  placeholder="Select State"
                  mandatory={true}
                >
                  {StateTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="cityTownVillage"
                  placeholder="City/Town/Village"
                  label="City"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="address"
                  placeholder="House No, Area name, near land mark, city, zip code"
                  label="Address"
                  mandatory={true}
                />

                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Communication Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.communication ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the communication details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="communicationNo"
                  label="Communication No:"
                  placeholder="(555) 123-4567"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phoneNo"
                  label="Phone No:"
                  placeholder="(555) 123-4567"
                  mandatory={true}
                />

                {/* Email Address */}
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email Address:"
                  placeholder="Enter your Gmail"
                  mandatory={true}
                />

                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Family Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.familyInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the Family details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="relationName1"
                  placeholder="Enter name"
                  label="Name"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="relationType1"
                  placeholder="Enter Relationship"
                  label="Relation"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="relationNo1"
                  label="Phone No:"
                  placeholder="(555) 123-4567"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="relationName2"
                  placeholder="Enter Mother name"
                  label="Name"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="relationType2"
                  placeholder="Enter Relationship"
                  label="Relation"
                />
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="relationNo2"
                  label="Phone No:"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Academic details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4  ">
                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Academic Information
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.academicInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the Academic details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="academicYear"
                  label="Academic Year"
                  placeholder="Select year"
                  mandatory={true}
                  onChange={(value) => {
                    onAcademicYearChange(value); // Original cascading select handler
                    if (typeof value === "string") {
                      handleTransportAcademicYearChange(value);
                    }
                  }}
                >
                  {isCastLoading.academicYears ? (
                    <option>Loading...</option>
                  ) : (
                    academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id.toString()}>
                        {year.label || year.name}
                      </SelectItem>
                    ))
                  )}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="branch"
                  label="Branch"
                  placeholder="Select branch"
                  mandatory={true}
                  onChange={onBranchChange}
                  disabled={isCastLoading.branches || branches.length === 0}
                >
                  {isCastLoading.branches ? (
                    <option>Loading...</option>
                  ) : (
                    branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.label || branch.name}
                      </SelectItem>
                    ))
                  )}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="joinYear"
                  label="Join Year"
                  placeholder="Select join year"
                  mandatory={true}
                >
                  {isCastLoading.joinYears ? (
                    <option>Loading...</option>
                  ) : (
                    joinYears.map((year) => (
                      <SelectItem key={year.id} value={year.id.toString()}>
                        {year.label || year.name}
                      </SelectItem>
                    ))
                  )}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="dateOfJoin"
                  label="Date of Join"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="classJoin"
                  label="Class Join"
                  placeholder="Select class join"
                  mandatory={true}
                  disabled={isCastLoading.classJoins || classJoins.length === 0}
                >
                  {isCastLoading.classJoins ? (
                    <option>Loading...</option>
                  ) : (
                    classJoins.map((classItem) => (
                      <SelectItem
                        key={classItem.id}
                        value={classItem.id.toString()}
                      >
                        {classItem.label || classItem.name}
                      </SelectItem>
                    ))
                  )}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="class"
                  label="Class"
                  placeholder="Select class"
                  mandatory={true}
                  onChange={onClassChange}
                  disabled={isCastLoading.classes || classes.length === 0}
                >
                  {isCastLoading.classes ? (
                    <option>Loading...</option>
                  ) : (
                    classes.map((classItem) => (
                      <SelectItem
                        key={classItem.id}
                        value={classItem.id.toString()}
                      >
                        {classItem.label || classItem.name}
                      </SelectItem>
                    ))
                  )}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="section"
                  label="Section"
                  placeholder="Select section"
                  mandatory={true}
                  disabled={isCastLoading.sections || sections.length === 0}
                >
                  {isCastLoading.sections ? (
                    <option>Loading...</option>
                  ) : (
                    sections.map((section) => (
                      <SelectItem
                        key={section.id}
                        value={section.id.toString()}
                      >
                        {section.label || section.name}
                      </SelectItem>
                    ))
                  )}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="admissionNo"
                  placeholder="xxxx"
                  label="Admission No"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="applicationNo"
                  placeholder="xxxx"
                  label="Application No"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="rollNo"
                  placeholder="xxxx"
                  label="Roll No"
                  mandatory={true}
                />

                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Finance Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.financeInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the Finance details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="feeCategory"
                  label="Fee Category"
                  placeholder="Select Fee Category"
                  mandatory={true}
                >
                  {feeCategories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.category}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Transport Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.transportInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>
                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the transport details of student
                  </p>
                </div>

                {/* Transport Section */}
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="transport"
                  label="Transport"
                  placeholder="Select Transport"
                  mandatory={true}
                  onChange={(e) => handleTransportChange(e as string)}
                >
                  {TransportTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                {selectedTransport === "Using" && (
                  <>
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name="routeName"
                      label="Route Name"
                      placeholder="Select Route"
                      onChange={(e) => handleRouteChange(e as string)}
                    >
                      {routes.map((route) => (
                        <SelectItem key={route.id} value={route.id.toString()}>
                          {route.routeName}
                        </SelectItem>
                      ))}
                    </CustomFormField>

                    {selectedRoute && (
                      <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="stopName"
                        label="Stop Name"
                        placeholder="Select stop"
                      >
                        {stops.map((stop) => (
                          <SelectItem key={stop.id} value={stop.id.toString()}>
                            {`${stop.stopName} (${stop.distance})`}
                          </SelectItem>
                        ))}
                      </CustomFormField>
                    )}
                  </>
                )}

                {/* Hostel Section */}
                <div className="col-span-full">
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Hostel Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.hostelInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 text-start">
                    Enter the hostel details of student
                  </p>
                </div>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="hostel"
                  label="Hostel"
                  placeholder="Select "
                  mandatory={true}
                  onChange={(e) => handleHostelChange(e as string)}
                >
                  {HostelTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                {selectedHostel === "Using" && (
                  <>
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name="hostelName"
                      label="Hostel Name"
                      placeholder="Select Hostel"
                      onChange={(e) => handleHostelNameChange(e as string)}
                    >
                      {hostels.map((hostel) => (
                        <SelectItem
                          key={hostel.id}
                          value={hostel.id.toString()}
                        >
                          {`${hostel.hostelName}`}
                        </SelectItem>
                      ))}
                    </CustomFormField>

                    {selectedHostel && (
                      <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="floorName"
                        label="Floor"
                        placeholder="Select Floor"
                      >
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id.toString()}>
                            {`Room ${room.roomNumber} (Floor ${room.floorNumber})`}
                          </SelectItem>
                        ))}
                      </CustomFormField>
                    )}
                  </>
                )}
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
            </div>
          </form>
        </div>
      </Form>
    </div>
  );
};

export default AdmissionForm;
