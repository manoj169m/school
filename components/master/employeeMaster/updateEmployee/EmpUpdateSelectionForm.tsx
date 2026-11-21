import React, { useState } from "react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { StaffTypes } from "@/constant/data";
import { EmpUpdateSelectionFormValues, EmpUpdateSelectionSchema } from "@/lib/validation/empValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { SelectItem } from "@/components/ui/select";
import { Breadcrumbs } from "@/components/breadcrumbs";

type EmpUpdateSelectionFormProps = {
  onFormSubmit: () => void;
};

const EmpUpdateSelection_Form: React.FC<EmpUpdateSelectionFormProps> = ({
  onFormSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmpUpdateSelectionFormValues>({
    resolver: zodResolver(EmpUpdateSelectionSchema),
    defaultValues: {
      empName: "",
    },
  });

  const onSubmit = async (values: EmpUpdateSelectionFormValues) => {
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
    { title: "Employee Update", link: "/master/EmployeeMaster/updateEmployee" },
  ];

  return (
    <div>
      <div className="p-6 ">
        {/* Header with Breadcrumbs */}
        <div className="flex justify-between items-center mr-3 mb-7">
          {/* Header Section */}
          <div className="text-left  ">
            <h1 className="text-lg lg:text-xl 2xl:text-2xl font-semibold text-black">
              Employee Update
            </h1>
            <p className="text-sm lg:text-md 2xl:text-lg text-slate-600">
              Manage employee update forms.
            </p>
          </div>
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        {/* Wrap form in FormProvider */}
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white -mb-12 shadow-lg rounded-lg p-6"
          >
            {/* Form fields */}
            <section className="">
              <div className=" flex justify-center items-center w-full">
                <div className="w-full max-w-xs">
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
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <Button
                  className="bg-custom-pink-300 px-10 hover:bg-custom-red-600 mt-3 mr-4"
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
    </div>
  );
};

export default EmpUpdateSelection_Form;
