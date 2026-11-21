"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import {
  EmpTypes,
  JobTypes,
  EmpDepartmentTypes,
  EmpDesignationTypes,
  TransTechTypes,
} from "@/constant/data";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import { CheckCircle, XCircle } from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { EmpJobSchema } from "@/lib/validation/empValidation";
type EmpJobFormValues = z.infer<typeof EmpJobSchema>;

const fieldGroups = {
  jobInfo: ["empQualification", "jobRole", "transport"],
} as const;

const EmpJobForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<EmpJobFormValues>({
    resolver: zodResolver(EmpJobSchema),
    defaultValues: {
      empQualification: "",
      empDesignation: "",
      empDepartment: "",
      jobRole: undefined,
      staffType: "",
      transport: "",
    },
  });

  const [validationStates, setValidationStates] = useState({
    jobInfo: false,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof EmpJobFormValues)[]
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
        jobInfo: checkFieldGroupValidity(fieldGroups.jobInfo),
      });
    });

    return () => subscription.unsubscribe();
  }, [form]); // Add `form` as a dependency

  const onSubmit = async (values: EmpJobFormValues) => {
    setIsLoading(true);
    try {
      // Check if all required fields are valid before proceeding
      if (validationStates.jobInfo) {
        console.log(values);
        // Navigate to the contact form if validation passes
        router.push("/master/EmployeeMaster/addEmployee?view=reporting");
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

  const goToPreviousForm = () => {
    // Navigate back to the personal form
    router.push("/master/EmployeeMaster/addEmployee?view=contact");
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
                      Job Oriented Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.jobInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the job oriented details of the employee
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="empQualification"
                  placeholder="Enter Qualification"
                  label="Qualification"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="empDesignation"
                  label="Designation"
                  placeholder="Select Designation"
                >
                  {EmpDesignationTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="empDepartment"
                  label="Department"
                  placeholder="Select Department"
                >
                  {EmpDepartmentTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.RADIO}
                  control={form.control}
                  name="jobRole"
                  label="Job Role"
                  mandatory={true}
                  options={JobTypes}
                />

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="staffType"
                  label="Staff Type"
                  placeholder="Select Type"
                >
                  {EmpTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.RADIO}
                  control={form.control}
                  name="transport"
                  label="Transport Facility"
                  mandatory={true}
                  options={TransTechTypes}
                />
              </div>
            </section>

            <div className="col-span-full flex justify-end mt-8 space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={goToPreviousForm}
              >
                Previous
              </Button>
              <Button
                type="submit"
                disabled={!validationStates.jobInfo || isLoading}
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

export default EmpJobForm;
