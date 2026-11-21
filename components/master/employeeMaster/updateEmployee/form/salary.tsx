"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { AccountNameTypes } from "@/constant/data";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import { CheckCircle, XCircle } from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { EmpSalarySchema } from "@/lib/validation/empValidation";
type EmpSalaryFormValues = z.infer<typeof EmpSalarySchema>;

const fieldGroups = {
  salaryInfo: [
    "empAccountNo",
    "empIfscCode",
    "empPfNo",
    "empEsiNo",
    "empPanNo",
    "empAadharNo",
  ],
} as const;

const EmpSalaryForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<EmpSalaryFormValues>({
    resolver: zodResolver(EmpSalarySchema),
    defaultValues: {
      empAccountName: "",
      empAccountNo: "",
      empIfscCode: "",
      empPfNo: "",
      empEsiNo: "",
      empPanNo: "",
      empAadharNo: "",
    },
  });

  const [validationStates, setValidationStates] = useState({
    salaryInfo: false,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof EmpSalaryFormValues)[]
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
        salaryInfo: checkFieldGroupValidity(fieldGroups.salaryInfo),
      });
    });

    return () => subscription.unsubscribe();
  }, [form]); // Add `form` as a dependency

  const onSubmit = async (values: EmpSalaryFormValues) => {
    setIsLoading(true);
    try {
      // Check if all required fields are valid before proceeding
      if (validationStates.salaryInfo) {
        console.log(values);
        // Navigate to the contact form if validation passes
        router.push("/master/EmployeeMaster/addEmployee?view=security");
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
    router.push("/master/EmployeeMaster/addEmployee?view=reporting");
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
                      Salary Related Information
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.salaryInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the salary related details of the employee
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="empAccountName"
                  label="Account Name"
                  placeholder="Select Account Name"
                >
                  {AccountNameTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="empAccountNo"
                  placeholder="Enter Account No"
                  label="Account No"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="empIfscCode"
                  placeholder="Enter IFSC Code"
                  label="IFSC Code"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="empPfNo"
                  placeholder="Enter PF Number"
                  label="PF Number"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="empEsiNo"
                  placeholder="Enter ESI Number"
                  label="ESI Number"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="empPanNo"
                  placeholder="Enter Pancard Number"
                  label="Pancard Number"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="empAadharNo"
                  placeholder="Enter Aadhar Number"
                  label="Aadhar Number"
                  mandatory={true}
                />
              </div>
            </section>

            {/* Submit Button */}
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
                disabled={!validationStates.salaryInfo || isLoading}
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

export default EmpSalaryForm;
