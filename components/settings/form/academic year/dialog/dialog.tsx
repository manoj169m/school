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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type SettingsAcademicYearFormValues = z.infer<typeof SettingsAcademicYearSchema>;

const AcademicYearDialog: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<SettingsAcademicYearFormValues>({
    resolver: zodResolver(SettingsAcademicYearSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      label: "",
      isCurrentYear: false,
    },
  });

  const onSubmit = async (values: SettingsAcademicYearFormValues) => {
    setIsLoading(true);
    try {
      // If setting as current year, first update all other years to false
      if (values.isCurrentYear) {
        await fetch("/api/academicYears/resetCurrentYear", {
          method: "PUT",
        });
      }

      const response = await fetch("/api/academicYears", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to create academic year");
      
      toast({
        title: "🙂 Success!",
        description: "Academic year created successfully.",
        className: styles.success,
      });
      
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create academic year:", error);
      
      toast({
        variant: "destructive",
        title: "😥 Uh oh! Something went wrong.",
        description: "There was a problem creating the academic year.",
        className: styles.error,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => onSubmit(values)}
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-custom-pink-300 px-6 text-white hover:bg-custom-red-600">
          Add Academic Year
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Academic Year</DialogTitle>
          <DialogDescription>
            Add a new academic year and specify if it`&apos;`s the current year.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="startDate"
              label="Start Date"
              placeholder=""
              mandatory={true}
            />
            
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="endDate"
              label="End Date"
              placeholder=""
              mandatory={true}
            />
            
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="label"
              label="Academic Year Name"
              placeholder="e.g., 2024-2025"
              mandatory={true}
            />

            <div className="space-y-2">
              <Label>Current Academic Year</Label>
              <RadioGroup
                defaultValue="false"
                onValueChange={(value) => 
                  form.setValue("isCurrentYear", value === "true")
                }
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="current-yes" />
                  <Label htmlFor="current-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="current-no" />
                  <Label htmlFor="current-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <DialogFooter>
              <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AcademicYearDialog;