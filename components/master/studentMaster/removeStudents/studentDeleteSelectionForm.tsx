import React, { useState } from "react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import {
  BranchTypes,
  FeeTypes,
  StaffTypes,
  StatusTypes,
  StudentTypes,
  TcTypes,
  YearTypes,
} from "@/constant/data";
import { selectStudentRemoveSchema, StudentRemoveSelectionForm } from "@/lib/validation/selectValidation";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, FormProvider } from "react-hook-form"; // Import FormProvider
import { SelectItem } from "@/components/ui/select";
import { Breadcrumbs } from "@/components/breadcrumbs";

type StudentRemoveSelectionFormProps = {
  onFormSubmit: () => void;
};

const RemoveStudentSelectionForm: React.FC<StudentRemoveSelectionFormProps> = ({
  onFormSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StudentRemoveSelectionForm>({
    resolver: zodResolver(selectStudentRemoveSchema),
    defaultValues: {
      academicYear: "",
      branch: "",
      studentStatus: "",
      student: "",
      feeStatus: "",
      dateOfLeaving: "",
      tc: "",
      tcNo: "",
      remarks: "",
      movedTo: "",
      permittedBy: "",
    },
  });

  // Watch the tc field to determine visibility of tcNo
  const tcValue = form.watch("tc");

  const onSubmit = async (values: StudentRemoveSelectionForm) => {
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
    { title: "Student Master", link: "#" },
    { title: "Remove Student", link: "/master/StudentMaster/removeStudent" },
  ];

  return (
    <div>
      <div className=" p-6">
        {/* Header with Breadcrumbs */}
        <div className="flex justify-between items-center mr-3 mb-7">
          {/* Header Section */}
          <div className="text-left ">
            <h1 className="text-lg lg:text-xl 2xl:text-2xl font-semibold text-black">
              Student Remove
            </h1>
            <p className="text-sm lg:text-md  2xl:text-lg text-slate-600">
              Manage Student remove Forms.
            </p>
          </div>
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        {/* Wrap form in FormProvider */}
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white shadow-lg rounded-lg p-6  "
          >
            {/* Form fields */}
            <section className="">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="academicYear"
                  label="Academic Year"
                  placeholder="Select"
                >
                  {YearTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="branch"
                  label="Branch"
                  placeholder="Select"
                  mandatory={true}
                >
                  {BranchTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="studentStatus"
                  label="Student Status"
                  placeholder="Select type"
                  mandatory={true}
                >
                  {StatusTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="student"
                  label="Students"
                  placeholder="Select"
                  mandatory={true}
                >
                  {StudentTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="dateOfLeaving"
                  label="Date of leaving"
                  placeholder="Select"
                />

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="feeStatus"
                  label="Fee Status "
                  placeholder="Select"
                >
                  {FeeTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="tc"
                  label="Tc"
                  placeholder="Select"
                  mandatory={true}
                >
                  {TcTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                {/* Conditionally render TC No field */}
                {tcValue === "issued" && (
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="tcNo"
                    label="Tc No"
                    placeholder="Enter TC No"
                    mandatory={true}
                  />
                )}

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="remarks"
                  label="Remarks "
                  placeholder=""
                  mandatory={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="movedTo"
                  label="Moved To "
                  placeholder="Select"
                  mandatory={true}
                >
                  {StatusTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="permittedBy"
                  label="Permitted By "
                  placeholder="Select"
                >
                  {StaffTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>
              <div className="flex justify-center mt-8">
                <Button
                  className="bg-custom-pink-300 px-10  hover:bg-custom-red-600 mt-3 mr-4"
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

export default RemoveStudentSelectionForm;
