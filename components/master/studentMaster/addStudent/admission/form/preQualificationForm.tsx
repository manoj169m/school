"use client";
import { useEffect, useState } from "react";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import { CheckCircle, XCircle } from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "@/components/ui/SubmitButton";
import { preQualificationSchema } from "@/lib/validation/admissionValidation";
import { z } from "zod";
type PreQualificationFormValues = z.infer<typeof preQualificationSchema>;

const fieldGroups = {
  lastStudiedInfo: ["institutionName", "tcNo", "place"],
  preQualificationInfo: [
    "schoolLastStudied",
    "classLastStudied",
    "percentage",
    "mark",
  ],
  courseInfo: [
    "courseName1",
    "courseDuration1",
    "scoredMarkOrPercentage1",

    "courseName2",
    "courseDuration2",
    "scoredMarkOrPercentage2",
  ],
} as const;

const PreQualificationForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<PreQualificationFormValues>({
    resolver: zodResolver(preQualificationSchema),
    defaultValues: {
      institutionName: "",
      tcNo: "",
      year: "",
      place: "",
      remarks: "",

      schoolLastStudied: "",
      classLastStudied: "",
      acadLastStudied: "",
      area: "",
      hallTicketNo: "",
      scanCopy: "",
      lastStudiedGroup: "",
      percentage: "",
      mark: "",

      courseName1: "",
      courseDuration1: "",
      coursePlace1: "",
      courseStatus1: "",
      scoredMarkOrPercentage1: "",
      courseInstituitionName1: "",

      courseName2: "",
      courseDuration2: "",
      coursePlace2: "",
      courseStatus2: "",
      scoredMarkOrPercentage2: "",
      courseInstituitionName2: "",
    },
  });

  const [validationStates, setValidationStates] = useState({
    lastStudiedInfo: false,
    preQualificationInfo: false,
    courseInfo: false,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof PreQualificationFormValues)[]
      ): boolean => {
        return fields.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          }
          return false; // Default to false if the value is neither string nor Date
        });
      };

      setValidationStates({
        lastStudiedInfo: checkFieldGroupValidity(fieldGroups.lastStudiedInfo),
        preQualificationInfo: checkFieldGroupValidity(
          fieldGroups.preQualificationInfo
        ),
        courseInfo: checkFieldGroupValidity(fieldGroups.courseInfo),
      });
    });

    return () => subscription.unsubscribe();
  }, [form]); // Add `form` as a dependency

  const onSubmit = async (values: PreQualificationFormValues) => {
    setIsLoading(true);
    try {
      console.log(values);
      // After successful submission, update validation states
      setValidationStates({
        lastStudiedInfo: fieldGroups.lastStudiedInfo.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          }
          return false; // Default to false if the value is neither string nor Date
        }),
        preQualificationInfo: fieldGroups.preQualificationInfo.every(
          (field) => {
            const value = values[field];
            if (typeof value === "string") {
              return value.trim() !== ""; // Only trim if the value is a string
            }
            return false; // Default to false if the value is neither string nor Date
          }
        ),
        courseInfo: fieldGroups.courseInfo.every((field) => {
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
                      Last Studied School/Collge Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.lastStudiedInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the qualification details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="institutionName"
                  placeholder="Enter "
                  label="Institution Name"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="tcNo"
                  placeholder="Enter "
                  label="Tc No"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="year"
                  placeholder="Enter "
                  label=" Year"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="place"
                  placeholder="Enter "
                  label="Place"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="remarks"
                  placeholder="enter"
                  label="Remarks"
                />
                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Pre Qualification Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.preQualificationInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the pre-qualification details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="schoolLastStudied"
                  placeholder="Enter "
                  label="School Last Studied"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="classLastStudied"
                  placeholder="xxxx xxxx xxxx"
                  label="Class Last Studied"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="acadLastStudied"
                  placeholder="xxxx"
                  label="Acad Last Studied"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="area"
                  placeholder="Enter"
                  label="Area"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="hallTicketNo"
                  placeholder="Enter"
                  label="Hall Ticket No"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="scanCopy"
                  placeholder="Enter"
                  label="Scan Copy"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="lastStudiedGroup"
                  placeholder="Enter "
                  label="Last Studied Group"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="percentage"
                  placeholder="Enter "
                  label="Percentage"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="mark"
                  placeholder="Enter "
                  label="Mark"
                  mandatory={true}
                />
              </div>

              {/* Academic details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Course Details - 1
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.courseInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the other course details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="courseName1"
                  placeholder="xxxx"
                  label="Course Name"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="courseDuration1"
                  placeholder="xxxx"
                  label="Course Duration"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="coursePlace1"
                  placeholder="xxxx"
                  label="Course Place"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="courseStatus1"
                  placeholder="xxxx"
                  label="Course Status"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="scoredMarkOrPercentage1"
                  placeholder="xxxx"
                  label="Mark / Percentage"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="courseInstituitionName1"
                  placeholder="xxxx"
                  label="Instituition Name"
                />
                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Course Details - 2
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.courseInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the other course details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="courseName2"
                  placeholder="xxxx"
                  label="Course Name"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="courseDuration2"
                  placeholder="xxxx"
                  label="Course Duration"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="coursePlace2"
                  placeholder="xxxx"
                  label="Course Place"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="courseStatus2"
                  placeholder="xxxx"
                  label="Course Status"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="scoredMarkOrPercentage2"
                  placeholder="xxxx"
                  label="Mark / Percentage"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="courseInstituitionName2"
                  placeholder="xxxx"
                  label="Instituition Name"
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

export default PreQualificationForm;
