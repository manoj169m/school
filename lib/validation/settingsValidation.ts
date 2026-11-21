import * as z from "zod";

//Profile
export const SettingsProfileSchema = z.object({
  name: z.string().optional(),
});

// Export the type inferred from the schema to use in your form handling
export type SettingsProfileFormValues = z.infer<typeof SettingsProfileSchema>;

//Settings Account Schema
export const SettingsAccountSchema = z.object({
  startDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  name: z.string().min(1, "required"),
  endDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
});

// Export the type inferred from the schema to use in your form handling
export type SettingsAccountFormValues = z.infer<typeof SettingsAccountSchema>;

// Custom validation for BigInt
const bigIntValidator = z.custom<bigint>((value) => {
  try {
    // Check if the value can be converted to a BigInt
    BigInt(value);
    return true;
  } catch {
    return false;
  }
}, {
  message: "Invalid BigInt value",
});

// Settings Branch
export const SettingsBranchSchema = z.object({
  name: z.string().min(1, "required"),
  acronym: z.string().min(1, "required"),
  label: z.string().min(1, "required"),
  inCharge: z.string().min(1, "required"),
  contact: bigIntValidator,
  address: z.string().min(1, "required"),
  location: z.string().min(1, "required"),
});

// Export the type inferred from the schema to use in your form handling
export type SettingsBranchFormValues = z.infer<typeof SettingsBranchSchema>;

//Settings Academic Year
export const SettingsAcademicYearSchema = z.object({
  isCurrentYear: z
    .boolean({
      required_error: "Current year selection is required",
      invalid_type_error: "Current year must be a boolean value",
    })
    .default(false),
  startDate: z
    .date({
      required_error: "Start date is required",
      invalid_type_error: "Start date must be a valid date",
    })
    .min(new Date(2000, 0, 1), "Start date cannot be before year 2000")
    .max(new Date(2100, 0, 1), "Start date cannot be after year 2100"),

  endDate: z
    .date({
      required_error: "End date is required",
      invalid_type_error: "End date must be a valid date",
    })
    .min(new Date(2000, 0, 1), "End date cannot be before year 2000")
    .max(new Date(2100, 0, 1), "End date cannot be after year 2100"),

  label: z
    .string({
      required_error: "Academic year label is required",
      invalid_type_error: "Label must be a string",
    })
    .min(1, "Label cannot be empty")
    .max(50, "Label cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9\s-]+$/,
      "Label can only contain letters, numbers, spaces, and hyphens"
    ),
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: "End date must be after start date",
    path: ["endDate"], // Highlights the endDate field for this error
  }
);


// Export the type inferred from the schema to use in your form handling
export type SettingsAcademicYearFormValues = z.infer<
  typeof SettingsAcademicYearSchema
>;

//Settings Auth
export const SettingsAuthSchema = z.object({
  permanentAddress: z.string().optional(),
});

// Export the type inferred from the schema to use in your form handling
export type SettingsAuthFormValues = z.infer<typeof SettingsAuthSchema>;

//Profile
export const SettingsPermissionSchema = z.object({
  permanentAddress: z.string().optional(),
});

// Export the type inferred from the schema to use in your form handling
export type SettingsPermissionFormValues = z.infer<
  typeof SettingsPermissionSchema
>;
