"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import {
  GenderTypes,
  BloodGroupTypes,
  MaritalStatusTypes,
} from "@/constant/data";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import { CheckCircle, XCircle } from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { EmpPersonalSchema } from "@/lib/validation/empValidation";
type EmpPersonalFormValues = z.infer<typeof EmpPersonalSchema>;

const fieldGroups = {
  personalInfo: [
    "firstName",
    "dateOfBirth",
    "gender",
    "maritalStatus",
    "dateOfJoin",
    "probationCompleteDate",
    "address",
    "permanentAddress",
  ],
} as const;

const EmpPersonalForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<EmpPersonalFormValues>({
    resolver: zodResolver(EmpPersonalSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: new Date(),
      gender: undefined,
      maritalStatus: undefined,
      fatherName: "",
      dateOfJoin: new Date(),
      probationCompleteDate: new Date(),
      bloodGroup: "",
      employeeCode: "",
      address: "",
      permanentAddress: "",
    },
  });

  const [validationStates, setValidationStates] = useState({
    personalInfo: false,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof EmpPersonalFormValues)[]
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
      });
    });

    return () => subscription.unsubscribe();
  }, [form]); // Add `form` as a dependency

  const onSubmit = async (values: EmpPersonalFormValues) => {
    setIsLoading(true);
    try {
      // Check if all required fields are valid before proceeding
      if (validationStates.personalInfo) {
        console.log(values);
        // Navigate to the contact form if validation passes
        router.push("/master/EmployeeMaster/addEmployee?view=contact");
      } else {
        // Optionally, you can show an error message
        form.setError("root", {
          type: "manual",
          message: "Please fill all required fields correctly.",
        });
      }
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
            <section className=" ">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4 p-0 md:p-3 ">
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
                    Enter the Personal details of the employee
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="firstName"
                  placeholder="Enter First name"
                  label="First Name"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="lastName"
                  placeholder="Enter Last name"
                  label="Last Name"
                />

                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="dateOfBirth"
                  label="Date of Birth"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.RADIO}
                  control={form.control}
                  name="gender"
                  label="Gender"
                  options={GenderTypes}
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.RADIO}
                  control={form.control}
                  name="maritalStatus"
                  label="Marital Status"
                  options={MaritalStatusTypes}
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="fatherName"
                  placeholder="Enter father name"
                  label="Father Name"
                />

                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="dateOfJoin"
                  label="Date of Join"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="probationCompleteDate"
                  label="Probation Complete Date"
                  mandatory={true}
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
                  name="employeeCode"
                  placeholder="Enter Employee Code"
                  label="Employee Code"
                />

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="address"
                  label="Present Address"
                  placeholder="123 Main St, City, State, ZIP"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="permanentAddress"
                  label="Permanent Address"
                  placeholder="123 Main St, City, State, ZIP"
                  mandatory={true}
                />
              </div>
            </section>

            {/* Submit Button */}
            <div className="col-span-full flex justify-end mt-8">
              <Button
                type="submit"
                disabled={!validationStates.personalInfo || isLoading}
              >
                {isLoading ? "Submitting..." : "Next"}
              </Button>
            </div>
          </form>
        </div>
      </Form>
    </div>
  );
};

export default EmpPersonalForm;
