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
import { SettingsAcademicYearSchema } from "@/lib/validation/settingsValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "@/public/assets/styles/toast.module.css";
import SubmitButton from "@/components/ui/SubmitButton";
import { ToastAction } from "@/components/ui/toast";

type SettingsAcademicYearFormValues = z.infer<
  typeof SettingsAcademicYearSchema
>;
const DialogDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SettingsAcademicYearFormValues>({
    resolver: zodResolver(SettingsAcademicYearSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      label: "",
    },
  });

  const onSubmit = async (values: SettingsAcademicYearFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/academicYears", {
        // Corrected endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      // Handle unsuccessful response
      if (!response.ok) throw new Error("Failed to create category");

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Academic Year</DialogTitle>
          <DialogDescription>
            Make changes to your academic year here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-4">
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="startDate"
                  label="Start Date"
                  placeholder=""
                  mandatory={true}
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="endDate"
                  label="End Date"
                  placeholder=""
                  mandatory={true}
                />
              </div>
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="label"
                label="Academic Year Name"
                placeholder=""
                mandatory={true}
              />
            </div>
            <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
          </form>
        </Form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DialogDemo;
