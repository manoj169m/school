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
import { studentParentSchema } from "@/lib/validation/admissionValidation";
import { z } from "zod";
type StudentParentFormValues = z.infer<typeof studentParentSchema>;

const fieldGroups = {
  studentOtherInfo: ["height", "weight"],
  familyOtherInfo: ["fatherOccupation", "fatherIncome", "fatherWorkPlace"],
} as const;

const StudentParentForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<StudentParentFormValues>({
    resolver: zodResolver(studentParentSchema),
    defaultValues: {
      mriNo: "",
      abcNo: "",
      identificationMark: "",
      height: "",
      weight: "",
      leftEyeSight: "",
      rightEyeSight: "",
      leftEar: "",
      rightEar: "",

      fatherOccupation: "",
      fatherIncome: "",
      fatherWorkPlace: "",
      motherOccupation: "",
      motherIncome: "",
      motherWorkPlace: "",
    },
  });

  const [validationStates, setValidationStates] = useState({
    studentOtherInfo: false,
    familyOtherInfo: false,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof StudentParentFormValues)[]
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
        studentOtherInfo: checkFieldGroupValidity(fieldGroups.studentOtherInfo),
        familyOtherInfo: checkFieldGroupValidity(fieldGroups.familyOtherInfo),
      });
    });

    return () => subscription.unsubscribe();
  }, [form]); // Add `form` as a dependency

  const onSubmit = async (values: StudentParentFormValues) => {
    setIsLoading(true);
    try {
      console.log(values);
      // After successful submission, update validation states
      setValidationStates({
        studentOtherInfo: fieldGroups.studentOtherInfo.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          } 
          return false; // Default to false if the value is neither string nor Date
        }),
        familyOtherInfo: fieldGroups.familyOtherInfo.every((field) => {
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
                      Student Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.studentOtherInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the other details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="mriNo"
                  placeholder="Enter "
                  label="MRI No"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="abcNo"
                  placeholder="Enter "
                  label="ABC No"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="identificationMark"
                  placeholder="Enter "
                  label="Identification Mark"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="height"
                  placeholder="Enter "
                  label="Height"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="weight"
                  placeholder="enter"
                  label="Weight"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="leftEyeSight"
                  placeholder="Enter "
                  label="Left Eye Sight"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="rightEyeSight"
                  placeholder="xxxx xxxx xxxx"
                  label="Right Eye Sight"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="leftEar"
                  placeholder="xxxx"
                  label="Left Ear"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="rightEar"
                  placeholder="Enter"
                  label="Right Ear"
                />
              </div>

              {/* Academic details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4 ">
                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Family Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.familyOtherInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the other family details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="fatherOccupation"
                  placeholder="xxxx"
                  label="Father Occupation"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="fatherIncome"
                  placeholder="xxxx"
                  label="Father Income"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="fatherWorkPlace"
                  placeholder="xxxx"
                  label="Work Place"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="motherOccupation"
                  placeholder="xxxx"
                  label="Mother Occupation"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="motherIncome"
                  placeholder="xxxx"
                  label="Mother Income"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="motherWorkPlace"
                  placeholder="xxxx"
                  label="Work Place"
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

export default StudentParentForm;
