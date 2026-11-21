"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import { CheckCircle, XCircle } from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { EmpContactSchema } from "@/lib/validation/empValidation";
type EmpContactFormValues = z.infer<typeof EmpContactSchema>;

const fieldGroups = {
  contactInfo: ["empPhoneNo", "empWorkPhoneNo", "empEmail", "empWorkEmail"],
} as const;

const EmpContactForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<EmpContactFormValues>({
    resolver: zodResolver(EmpContactSchema),
    defaultValues: {
      empPhoneNo: "",
      empWorkPhoneNo: "",
      empEmail: "",
      empWorkEmail: "",
    },
  });

  const [validationStates, setValidationStates] = useState({
    contactInfo: false,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof EmpContactFormValues)[]
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
        contactInfo: checkFieldGroupValidity(fieldGroups.contactInfo),
      });
    });

    return () => subscription.unsubscribe();
  }, [form]); // Add `form` as a dependency

  const onSubmit = async (values: EmpContactFormValues) => {
    setIsLoading(true);
    try {
      // Check if all required fields are valid before proceeding
      if (validationStates.contactInfo) {
        console.log(values);
        // Navigate to the contact form if validation passes
        router.push("/master/EmployeeMaster/addEmployee?view=job");
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
    router.push("/master/EmployeeMaster/addEmployee?view=personal");
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
                      Contact Information
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.contactInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the contact details of the employee
                  </p>
                </div>
                {/* Mobile No */}
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="empPhoneNo"
                  label="Mobile No:"
                  placeholder="(555) 123-4567"
                  mandatory={true}
                />

                {/* Work/Alternative Mobile No */}
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="empWorkPhoneNo"
                  label="Work/Alternative Mobile No:"
                  placeholder="(555) 123-4567"
                  mandatory={true}
                />

                {/* Email Address */}
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="empEmail"
                  label="Email Address:"
                  iconSrc="/assets/icons/email.svg"
                  iconAlt="email"
                  placeholder="Enter your Gmail"
                />

                {/* Work Email Address */}
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="empWorkEmail"
                  label="Work Email Address:"
                  iconSrc="/assets/icons/email.svg"
                  iconAlt="email"
                  placeholder="Enter your Gmail"
                />
              </div>
            </section>

            {/* Submit and Previous Buttons */}
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
                disabled={!validationStates.contactInfo || isLoading}
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

export default EmpContactForm;
