"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import { z } from "zod";
import { SettingsPermissionSchema } from "@/lib/validation/settingsValidation";
import { ModuleAccessManagement } from "./module/ModuleManagment";
type SettingsPermissionFormValues = z.infer<typeof SettingsPermissionSchema>;

const fieldGroups = {
  PermissionInfo: ["permanentAddress"],
} as const;

const SettingsPermissionForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SettingsPermissionFormValues>({
    resolver: zodResolver(SettingsPermissionSchema),
    defaultValues: {
      permanentAddress:"",
    },
  });
console.log(isLoading);

  const [validationStates, setValidationStates] = useState({
    PermissionInfo: false,
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const checkFieldGroupValidity = (
        fields: readonly (keyof SettingsPermissionFormValues)[]
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
        PermissionInfo: checkFieldGroupValidity(fieldGroups.PermissionInfo),
      });
    });

    return () => subscription.unsubscribe();
  }, [form]); // Add `form` as a dependency

  const onSubmit = async (values: SettingsPermissionFormValues) => {
    setIsLoading(true);
    try {
      // Check if all required fields are valid before proceeding
      if (validationStates.PermissionInfo) {
        console.log(values);
        // Navigate to the contact form if validation passes
        router.push("/master/EmployeeMaster/addEmployee?view=contact");
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
  console.log(onSubmit);
  

  return (
    <div className="p-6">
    <ModuleAccessManagement/>
    </div>
  );
};

export default SettingsPermissionForm;
