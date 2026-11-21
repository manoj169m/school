import React, { useState } from "react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { StaffTypes } from "@/constant/data";
import {
  EmpRemoveSelectionFormValues,
  EmpRemoveSelectionSchema,
} from "@/lib/validation/empValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { SelectItem } from "@/components/ui/select";
import { Breadcrumbs } from "@/components/breadcrumbs";

type EmpRemoveSelectionFormProps = {
  onFormSubmit: () => void;
};

const EmpRemoveSelection_Form: React.FC<EmpRemoveSelectionFormProps> = ({
  onFormSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmpRemoveSelectionFormValues>({
    resolver: zodResolver(EmpRemoveSelectionSchema),
    defaultValues: {
      empName: "",
      dateOfLeaving: new Date(),
    },
  });

  const onSubmit = async (values: EmpRemoveSelectionFormValues) => {
    setIsLoading(true);
    try {
      console.log(values);
      onFormSubmit(); // Trigger the callback on successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { title: "Master", link: "/" },
    { title: "Employee Master", link: "#" },
    { title: "Employee remove", link: "/master/EmployeeMaster/removeEmployee" },
  ];

  return (
    <div className="p-6  ">
      {/* Header with Breadcrumbs */}
      <div className="flex justify-between items-center mb-7">
        {/* Header Section */}
        <div className="text-left">
          <h1 className="text-lg lg:text-xl 2xl:text-2xl font-semibold text-black">
            Remove Employee
          </h1>
          <p className="text-sm lg:text-md 2xl:text-lg text-slate-600">
            Manage employee remove forms.
          </p>
        </div>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Wrap form in FormProvider */}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          {/* Form fields */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="empName"
                label="Employee Name"
                placeholder="Select"
                mandatory={true}
              >
                {StaffTypes.map((type, i) => (
                  <SelectItem key={type + i} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </CustomFormField>

              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="dateOfLeaving"
                label="Date Of Leaving"
                placeholder=""
                mandatory={true}
              />
            </div>

            <div className="flex justify-center">
              <Button
                className="bg-custom-pink-300 px-10 hover:bg-custom-red-600"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </section>
        </form>
      </FormProvider>
    </div>
  );
};

export default EmpRemoveSelection_Form;
