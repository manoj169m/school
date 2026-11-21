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
import { studentActivitiesSchema } from "@/lib/validation/admissionValidation";
import { z } from "zod";
type StudentActivitiesFormValues = z.infer<typeof studentActivitiesSchema>;

const fieldGroups = {
  extraActivityInfo: ["activityName", "activityConductedBy", "date"],
  sportsInfo: ["sportName", "conductedBy", "sportDate"],
} as const;

const ActivitiesForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<StudentActivitiesFormValues>({
    resolver: zodResolver(studentActivitiesSchema),
    defaultValues: {
      activityName: "",
      activityConductedBy: "",
      date: "",
      price: "",
      place: "",
      scanCopy: "",

      sportName: "",
      conductedBy: "",
      level: "",
      sportDate: "",
      sportPlace: "",
      sportPrice: "",
      sportScanCopy: "",
    },
  });

  const [validationStates, setValidationStates] = useState({
    extraActivityInfo: false,
    sportsInfo: false,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof StudentActivitiesFormValues)[]
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
        extraActivityInfo: checkFieldGroupValidity(
          fieldGroups.extraActivityInfo
        ),
        sportsInfo: checkFieldGroupValidity(fieldGroups.sportsInfo),
      });
    });

    return () => subscription.unsubscribe();
  }, [form]); // Add `form` as a dependency

  const onSubmit = async (values: StudentActivitiesFormValues) => {
    setIsLoading(true);
    try {
      console.log(values);
      // After successful submission, update validation states
      setValidationStates({
        extraActivityInfo: fieldGroups.extraActivityInfo.every((field) => {
          const value = values[field];
          if (typeof value === "string") {
            return value.trim() !== ""; // Only trim if the value is a string
          }
          return false; // Default to false if the value is neither string nor Date
        }),
        sportsInfo: fieldGroups.sportsInfo.every((field) => {
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
                      Extra Cicular Activities Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.extraActivityInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the Extra Cicular Activities Details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="activityName"
                  placeholder="Enter "
                  label="Activity Name"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="activityConductedBy"
                  placeholder="Enter "
                  label="Conducted By"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="date"
                  placeholder="Enter "
                  label=" Date"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="place"
                  placeholder="Enter "
                  label="Place"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="price"
                  placeholder="enter"
                  label="Price"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="scanCopy"
                  placeholder="Enter "
                  label="Scan Copy"
                />
              </div>

              {/* Academic details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-full">
                  {/* Title, Horizontal Line, and Icon*/}
                  <div className="flex items-center space-x-4">
                    <p className="text-xl text-black font-semibold">
                      Sport Activities Details
                    </p>
                    <hr className="flex-grow border-red-600 mt-2" />
                    {validationStates.sportsInfo ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-400 text-start">
                    Enter the Sport Activities details of student
                  </p>
                </div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="sportName"
                  placeholder="xxxx"
                  label="Sports Name"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="conductedBy"
                  placeholder="xxxx"
                  label=" Conducted By"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="sportDate"
                  placeholder="xxxx"
                  label=" Date"
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="sportPlace"
                  placeholder="xxxx"
                  label="Place"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="level"
                  placeholder="xxxx"
                  label=" Level"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="sportPrice"
                  placeholder="xxxx"
                  label=" Price"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="sportScanCopy"
                  placeholder="xxxx"
                  label=" Scan Copy"
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

export default ActivitiesForm;
