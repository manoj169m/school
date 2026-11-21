"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import { CheckCircle, XCircle } from "lucide-react";
import { z } from "zod";
import SubmitButton from "@/components/ui/SubmitButton";
import { SettingsAccountSchema } from "@/lib/validation/settingsValidation";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
type SettingsAccountFormValues = z.infer<typeof SettingsAccountSchema>;

const fieldGroups = {
  accountInfo: ["startDate", "name", "endDate"],
} as const;

const SettingsAccountForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SettingsAccountFormValues>({
    resolver: zodResolver(SettingsAccountSchema),
    defaultValues: {
      startDate: new Date(),
      name: "",
      endDate: new Date(),
    },
  });

  const [validationStates, setValidationStates] = useState({
    accountInfo: false,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof SettingsAccountFormValues)[]
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
        accountInfo: checkFieldGroupValidity(fieldGroups.accountInfo),
      });
    });

    return () => subscription.unsubscribe();
  }, [form]); // Add `form` as a dependency

  const onSubmit = async (values: SettingsAccountFormValues) => {
    setIsLoading(true);
    try {
      // Check if all required fields are valid before proceeding
      if (validationStates.accountInfo) {
        console.log(values);
        // Navigate to the contact form if validation passes
        router.push("#");
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
                      Account Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.accountInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the account details.
                  </p>
                </div>

                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="startDate"
                  label="Start Date"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="endDate"
                  label="End Date"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  placeholder=" "
                  label="Name"
                  mandatory={true}
                />
              </div>
            </section>

            {/* Submit Button */}
            <div className="col-span-full flex justify-end mt-8">
              <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
            </div>
          </form>
        </div>
      </Form>
    </div>
  );
};

export default SettingsAccountForm;
