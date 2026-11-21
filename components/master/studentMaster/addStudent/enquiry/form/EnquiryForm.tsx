"use client";
import { useEffect, useState } from "react";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import {
  GenderTypes,
  StaffTypes,
  ClassTypes,
  StateTypes,
  EnquiryStatusTypes,
  BranchTypes,
} from "@/constant/data";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import {
  CheckCircle,
  XCircle,
} from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import SubmitButton from "@/components/ui/SubmitButton";
import { enquirySchema } from "@/lib/validation/enquiryValidation";
import { z } from "zod";

type EnquiryFormValues = z.infer<typeof enquirySchema>;

const fieldGroups = {
  personalInfo: ["firstName", "gender", "dateOfBirth", "admissionForGrade"],
  communication: ["communicationNo", "fatherNo", "address"],
  familyInfo: ["fatherName", "fatherOccupation", "state", "cityTownVillage"],
  past: ["currentStudyingSchool"],
  enquiry: ["status", "branch"],
} as const;



const EnquiryForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      dateOfBirth: new Date(),
      yearOfAdmission: "",
      admissionForGrade: "",
      enquiredByStaff: "",
      communicationNo: "",
      fatherNo: "",
      email: "",
      currentStudyingSchool: "",
      fatherName: "",
      fatherOccupation: "",
      motherName: "",
      motherOccupation: "",
      state: "",
      cityTownVillage: "",
      status: "",
      branch:"",
      address: "",
    },
  });

  const [validationStates, setValidationStates] = useState({
    personalInfo: false,
    communication: false,
    familyInfo: false,
    past: false,
    enquiry: false,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof EnquiryFormValues)[]
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
        past: checkFieldGroupValidity(fieldGroups.past),
        enquiry: checkFieldGroupValidity(fieldGroups.enquiry),
      });
    });

    return () => subscription.unsubscribe();
  }, [form]); // Add `form` as a dependency

  const onSubmit = async (values: EnquiryFormValues) => {
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
        past: fieldGroups.past.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          } 
          return false; // Default to false if the value is neither string nor Date
        }),
        enquiry: fieldGroups.enquiry.every((field) => {
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
                  label="Sur Name"
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
                  name="yearOfAdmission"
                  placeholder="Year of admission"
                  label="Year of admission"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="admissionForGrade"
                  label="Admission for Grade"
                  placeholder="Select class"
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
                  name="enquiredByStaff"
                  label="Enquired by Staff"
                  placeholder="Select staff"
                >
                  {StaffTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>

              {/* communication */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4 ">
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

                {/* Student Mobile No */}
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="communicationNo"
                  label="Communication No:"
                  placeholder="(555) 123-4567"
                  mandatory={true}
                />

                {/* Student Mobile No */}
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="fatherNo"
                  label="Father Mobile No:"
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

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="address"
                  label="Current Address"
                  placeholder="123 Main St, City, State, ZIP"
                  mandatory={true}
                />
              </div>

              {/* family details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4 p-0 md:p-3 md:border-r border-red-600">
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
                  name="fatherName"
                  placeholder="Enter father name"
                  label="Father Name"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="fatherOccupation"
                  placeholder="Enter father Occupation"
                  label="Father Occupation"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="motherName"
                  placeholder="Enter Mother name"
                  label="Mother Name"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="motherOccupation"
                  placeholder="Enter mother Occupation"
                  label="Mother Occupation"
                />

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
                  placeholder="Enter city name"
                  label="City Name"
                  mandatory={true}
                />
              </div>

              {/* past academic details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4 ">
                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Past Academic Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.past ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the Past Academic details of student
                  </p>
                </div>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="currentStudyingSchool"
                  label="Current Studying School"
                  placeholder="Enter School Name"
                  mandatory={true}
                />

                {/* enquiry status */}

                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Enquiry Status
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.enquiry ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the enquiry status of student
                  </p>
                </div>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="status"
                  label="Status"
                  placeholder="Select Status"
                  mandatory={true}
                >
                  {EnquiryStatusTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="branch"
                  label="Branch"
                  placeholder="Select branch"
                  mandatory={true}
                >
                  {BranchTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
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

export default EnquiryForm;
