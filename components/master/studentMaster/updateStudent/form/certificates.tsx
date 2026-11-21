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
import SubmitButton from "@/components/ui/SubmitButton";
import { studentCertificatesSchema } from "@/lib/validation/admissionValidation";
import { z } from "zod";

type StudentCertficatesFormValues = z.infer<typeof studentCertificatesSchema>;

const fieldGroups = {
  personalCertificatesInfo: ["pCertificateName", "pSubmittedDate"],
  courseCertificatesInfo: ["cCertificateName", "cSubmittedDate"],
} as const;

const CertificatesForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StudentCertficatesFormValues>({
    resolver: zodResolver(studentCertificatesSchema),
    defaultValues: {
      pCertificateName: "",
      pSubmittedDate: new Date(),
      pSubmittedBy: "",
      cCertificateName: "",
      cSubmittedDate: new Date(),
      cSubmittedBy: "",
    },
  });

  // Default validation states set to false
  const [validationStates, setValidationStates] = useState({
    personalCertificatesInfo: false,
    courseCertificatesInfo: false,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof StudentCertficatesFormValues)[]
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
        personalCertificatesInfo: checkFieldGroupValidity(
          fieldGroups.personalCertificatesInfo
        ),
        courseCertificatesInfo: checkFieldGroupValidity(
          fieldGroups.courseCertificatesInfo
        ),
      });
    });

    return () => subscription.unsubscribe();
  }, [form]); // Add `form` as a dependency

  const onSubmit = async (values: StudentCertficatesFormValues) => {
    setIsLoading(true);
    try {
      console.log(values);

      // After successful submission, update validation states
      setValidationStates({
        personalCertificatesInfo: fieldGroups.personalCertificatesInfo.every(
          (field) => {
            const value = values[field];
            if (typeof value === "string") {
              return value.trim() !== ""; // Only trim if the value is a string
            } else if (value instanceof Date) {
              return !isNaN(value.getTime()); // Check if the Date is valid
            }
            return false; // Default to false if the value is neither string nor Date
          }
        ),
        courseCertificatesInfo: fieldGroups.courseCertificatesInfo.every(
          (field) => {
            const value = values[field];
            if (typeof value === "string") {
              return value.trim() !== ""; // Only trim if the value is a string
            } else if (value instanceof Date) {
              return !isNaN(value.getTime()); // Check if the Date is valid
            }
            return false; // Default to false if the value is neither string nor Date
          }
        ),
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
              {/* Personal Certificates Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4 p-0 md:p-3 md:border-r border-red-600">
                <div className="col-span-full">
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Personal Certificates
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.personalCertificatesInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 text-start">
                    Enter the Personal Certificates Details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="pCertificateName"
                  placeholder="Enter certificate name"
                  label="Certificate Name"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="pSubmittedDate"
                  placeholder="Enter date"
                  label="Submitted Date"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="pSubmittedBy"
                  placeholder="Enter name"
                  label="Submitted By"
                />
              </div>

              {/* Course Certificates Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-full">
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Course Certificates
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.courseCertificatesInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 text-start">
                    Enter the Course Certificates Details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="cCertificateName"
                  placeholder="Enter certificate name"
                  label="Certificate Name"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="cSubmittedDate"
                  placeholder="Enter date"
                  label="Submitted Date"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="cSubmittedBy"
                  placeholder="Enter name"
                  label="Submitted By"
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

export default CertificatesForm;
