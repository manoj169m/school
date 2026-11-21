"use client";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { SettingsBranchSchema } from "@/lib/validation/settingsValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "@/public/assets/styles/toast.module.css";
import SubmitButton from "@/components/ui/SubmitButton";
import { ToastAction } from "@/components/ui/toast";

type SettingsBranchFormValues = z.infer<typeof SettingsBranchSchema>;
const DialogDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SettingsBranchFormValues>({
    resolver: zodResolver(SettingsBranchSchema),
    defaultValues: {
      name: "",
      acronym: "",
      label: "",
      inCharge: "",
      contact: BigInt(0),
      address: "",
      location: "",
    },
  });

  const onSubmit = async (values: SettingsBranchFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/branches", {
        // Corrected endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      
      const result = await response.json();
      console.log(result);

      // Show success toast
      toast({
        title: "🙂 Success!",
        description: "Category created successfully.",
        className: styles.success,
      });
    } catch (error) {
      console.error("Failed to create category:", error);

      // Show error toast with retry action
      toast({
        variant: "destructive", // Assuming variant is used for styling errors
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem creating the category.",
        className: styles.error,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => onSubmit(values)} // Retry logic: attempt to create category again
          >
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-custom-pink-300 px-6  text-white hover:bg-custom-red-600">
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className=" bg-white p-6 max-w-screen-lg mx-auto h-[90vh] max-h-[90vh] overflow-auto rounded-lg shadow-lg">
        <DialogHeader className="mt-6">
          <DialogTitle>Add School branches</DialogTitle>
          <DialogDescription>
            Make changes to your School branches here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <hr className="flex-grow border-red-600  mb-4" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4 -mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4 p-0 md:p-3">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  label="School Name"
                  placeholder=""
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="acronym"
                  label="School Acronym"
                  placeholder=""
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="label"
                  label="label Name"
                  placeholder="(Primary or Secondary)"
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="inCharge"
                  label="InCharge Name"
                  placeholder=""
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="contact"
                  label="Contact Details"
                  placeholder=""
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="location"
                  label="Location "
                  placeholder=""
                  mandatory={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="address"
                  label="Address Details"
                  placeholder=""
                  mandatory={true}
                />
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
            </div>
          </form>
        </Form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DialogDemo;
