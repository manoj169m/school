"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { StudentEditTypes, PastFinanceTypes, PhNoTypes } from "@/constant/data";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import { CheckCircle, XCircle } from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { EmpSecuritySchema } from "@/lib/validation/empValidation";
import { toast } from "@/hooks/use-toast";

type EmpSecurityFormValues = z.infer<typeof EmpSecuritySchema>;

const fieldGroups = {
  SecurityInfo: ["pastFinanceEntries", "phNoDisplay", "studentEdit"],
} as const;

const EmpSecurityForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<EmpSecurityFormValues>({
    resolver: zodResolver(EmpSecuritySchema),
    defaultValues: {
      pastFinanceEntries: "",
      phNoDisplay: "",
      studentEdit: "",
    },
  });

  const [validationStates, setValidationStates] = useState({
    SecurityInfo: false,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof EmpSecurityFormValues)[]
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
        SecurityInfo: checkFieldGroupValidity(fieldGroups.SecurityInfo),
      });
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (values: EmpSecurityFormValues) => {
    setIsLoading(true);
    try {
      if (validationStates.SecurityInfo) {
        console.log("Final form submission:", values);

        toast({
          title: "Employee Registration",
          description: "Employee details submitted successfully!",
          variant: "default",
        });

        // Redirect to success page and then reload
        window.location.href = "#";
      } else {
        toast({
          title: "Validation Error",
          description: "Please fill all required fields correctly.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Error",
        description: "An error occurred while submitting employee details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const goToPreviousForm = () => {
    // Navigate back to the salary form
    router.push("/master/EmployeeMaster/addEmployee?view=salary");
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
                      Security Permissions
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.SecurityInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the security permissions details for the employee
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="pastFinanceEntries"
                  label="Past Date Finance Entries"
                  placeholder="Select"
                  mandatory={true}
                >
                  {PastFinanceTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="phNoDisplay"
                  label="Ph.No Display"
                  placeholder="Select"
                  mandatory={true}
                >
                  {PhNoTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="studentEdit"
                  label="Student Edit Option"
                  placeholder="Select"
                  mandatory={true}
                >
                  {StudentEditTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
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
                disabled={!validationStates.SecurityInfo || isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </Form>
    </div>
  );
};

export default EmpSecurityForm;
