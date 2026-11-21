"use client";
import { useEffect, useState } from "react";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import {
  GenderTypes,
  ClassTypes,
  StateTypes,
  BloodGroupTypes,
  CountryTypes,
  YearTypes,
  SectionTypes,
  DepartmentTypes,
  BranchTypes,
} from "@/constant/data";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import { CheckCircle, XCircle } from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import SubmitButton from "@/components/ui/SubmitButton";
import { reservationSchema } from "@/lib/validation/reservationValidation";
import { z } from "zod";
type ReservationFormValues = z.infer<typeof reservationSchema>;

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
  communication: ["communicationNo", "phoneNo"],
  familyInfo: ["relationName1", "relationType1", "relationNo1"],
  academicInfo: [
    "academicYear",
    "branch",
    "joinYear",
    "dateOfJoin",

    "classJoin",
    "sectionJoin",

    "class",
    "section",

    "applicationNo",
  ],
  financeInfo: ["feeCategory"],
  transportInfo: ["transport"],
  hostelInfo: ["hostel"],
  messInfo: ["category"],
} as const;

const ReservationForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      dateOfBirth: new Date(),
      community: "",
      caste: "",
      bloodGroup: "",
      studMotherTongue: "",
      studReligion: "",
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
      branch:"",
      joinYear: "",
      dateOfJoin: new Date(),
      departmentJoin: "",
      classJoin: "",
      sectionJoin: "",
      department: "",
      class: "",
      section: "",
      admissionNo: "",
      applicationNo: "",
      rollNo: "",

      feeCategory: "",
      scholarshipCategory: "",
      concessionCategory: "",

      transport: "",
      route: "",
      stage: "",

      hostel: "",
      block: "",
      room: "",

      dayorder: "",
      category: "",
    },
  });

  const [validationStates, setValidationStates] = useState({
    personalInfo: false,
    communication: false,
    familyInfo: false,
    academicInfo: false,
    financeInfo: false,
    transportInfo: false,
    hostelInfo: false,
    messInfo: false,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof ReservationFormValues)[]
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
        messInfo: checkFieldGroupValidity(fieldGroups.messInfo),
      });
    });

    return () => subscription.unsubscribe();
  }, [form]); // Add `form` as a dependency

  const onSubmit = async (values: ReservationFormValues) => {
    setIsLoading(true);
    try {
      console.log(values);
      // After successful submission, update validation states
      setValidationStates({
        personalInfo: fieldGroups.personalInfo.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          } else if (value instanceof Date) {
            return !isNaN(value.getTime()); // Check if the Date is valid
          }
          return false; // Default to false if the value is neither string nor Date
        }),
        communication: fieldGroups.communication.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          }
          return false; // Default to false if the value is neither string nor Date
        }),
        familyInfo: fieldGroups.familyInfo.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          }
          return false; // Default to false if the value is neither string nor Date
        }),
        academicInfo: fieldGroups.academicInfo.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          } else if (value instanceof Date) {
            return !isNaN(value.getTime()); // Check if the Date is valid
          }
          return false; // Default to false if the value is neither string nor Date
        }),
        financeInfo: fieldGroups.financeInfo.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          }
          return false; // Default to false if the value is neither string nor Date
        }),
        transportInfo: fieldGroups.transportInfo.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          }
          return false; // Default to false if the value is neither string nor Date
        }),
        hostelInfo: fieldGroups.hostelInfo.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          }
          return false; // Default to false if the value is neither string nor Date
        }),
        messInfo: fieldGroups.messInfo.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          }
          return false; // Default to false if the value is neither string nor Date
        }),
      });

      // Proceed to the success page
      router.push("/success");
    } catch (error) {
      console.error("Error submitting form:", error);
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
                  name="studMotherTongue"
                  placeholder="Mother tongue"
                  label="Mother Tongue"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="studReligion"
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
                  placeholder="Enter  name"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4">
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
                  label="Academic year"
                  placeholder="Select year"
                  mandatory={true}
                >
                  {YearTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="branch"
                  label=" Branch"
                  placeholder="Select year"
                  mandatory={true}
                >
                  {BranchTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="joinYear"
                  placeholder="xxxx"
                  label="join Year"
                  mandatory={true}
                />

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
                  name="departmentJoin"
                  label="Department Join"
                  placeholder="Select "
                >
                  {DepartmentTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="classJoin"
                  label="Class Join"
                  placeholder="Select "
                  mandatory={true}
                >
                  {ClassTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="sectionJoin"
                  label="Section Join"
                  placeholder="Select "
                  mandatory={true}
                >
                  {SectionTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="department"
                  label="Department "
                  placeholder="Select "
                >
                  {DepartmentTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="class"
                  label="Class "
                  placeholder="Select "
                  mandatory={true}
                >
                  {ClassTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="section"
                  label="Section "
                  placeholder="Select "
                  mandatory={true}
                >
                  {SectionTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="admissionNo"
                  placeholder="xxxx"
                  label="Admission No"
                  disabled={true} // Pass the disabled prop
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="applicationNo"
                  placeholder="xxxx"
                  label="Application No"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="rollNo"
                  placeholder="xxxx"
                  label="Roll No"
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
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="feeCategory"
                  label="Fee Category"
                  placeholder="Enter"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="scholarshipCategory"
                  label="Scholarship Category"
                  placeholder="Enter"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="concessionCategory"
                  label="Concession Category"
                  placeholder="Enter"
                />

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
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="transport"
                  label="Transport"
                  placeholder="Enter"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="route"
                  label="Route"
                  placeholder="Enter"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="stage"
                  label=" Stage"
                  placeholder="Enter"
                />

                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
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
                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the hostel details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="hostel"
                  label="Hostel"
                  placeholder="Enter"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="block"
                  label="Block"
                  placeholder="Enter"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="room"
                  label=" Room"
                  placeholder="Enter"
                />

                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Mess Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.messInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>
                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the mess details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="dayorder"
                  label="Day Order"
                  placeholder="Enter"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="category"
                  label="Category"
                  placeholder="Enter"
                  mandatory={true}
                />
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

export default ReservationForm;
