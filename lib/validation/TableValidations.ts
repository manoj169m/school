import * as z from "zod";

// Zod validation schema for Subject
export const SubjectValidation = z.object({
  name: z.string().nonempty({ message: "Subject Name is required" }),
  code: z.string().nonempty({ message: "Subject Code is required" }),
  description: z.string().optional(),
});

// Interface extracted from Zod schema
export interface Subject {
  name: string;
  code: string;
  description?: string;
}

// Type for the input validation
export type SubjectInput = z.infer<typeof SubjectValidation>;

// section interface
export const SectionValidation = z.object({
  name: z.string().nonempty({ message: "Class Name is required" }),
  acronym: z.string().nonempty({ message: "Acronym is required" }),
  displayOrder: z.number().optional(),
});

// Interface extracted from Zod schema
export interface Section {
  name: string;
  acronym: string;
  displayOrder?: number;
}

// Type for the input validation
export type SectionInput = z.infer<typeof SectionValidation>;

// ClassCreation form interface
export const ClassValidation = z.object({
  name: z.string().nonempty({ message: "Class Name is required" }),
  acronym: z.string().nonempty({ message: "Acronym is required" }),
  displayOrder: z
    .number()
    .nonnegative({ message: "Display order should be a positive number" }), // You can add constraints here if needed
});

// Interface extracted from Zod schema
export interface Class {
  name: string;
  acronym: string;
  displayOrder: number;
}

// Type for the input validation
export type ClassInput = z.infer<typeof ClassValidation>;

// AccountCreation form interface
export interface AccountCreationFormValues {
  accountName: string;
  accountType: "ASSET" | "INCOME" | "EXPENSE" | "LIABILITY";
  description?: string;
  openingBalance: number;
}

// Validation schema for account creation
export const AccountValidation = z.object({
  accountName: z.string().nonempty({ message: "Account Name is required" }),
  accountType: z.enum(["ASSET", "INCOME", "EXPENSE", "LIABILITY"], {
    errorMap: () => ({ message: "Invalid account type selected" }),
  }),
  description: z.string().optional(),
  openingBalance: z
    .number()
    .min(0, { message: "Opening balance must be a positive number" }),
  applicableFor: z.enum(["TRANSPORT", "HOSTEL", "NONE"], {
    errorMap: () => ({ message: "Invalid applicability selected" }),
  }),
});

// Type for the input validation
export type AccountInput = z.infer<typeof AccountValidation>;

// CategoryCreation form interface
export interface CategoryCreationFormValues {
  category: string;
  description?: string;
}

// Validation schema for category creation
export const CategoryValidation = z.object({
  category: z.string().nonempty({ message: "Category is required" }),
  description: z.string().optional(),
});

// Type for the input validation
export type CategoryInput = z.infer<typeof CategoryValidation>;

// Validation schema for Concession Category
export const ConcessionCategoryValidation = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().optional(),
});

export type ConcessionCategoryInput = z.infer<
  typeof ConcessionCategoryValidation
>;

export const HostelValidation = z.object({
  hostelName: z
    .string()
    .nonempty({ message: "Hostel Name is required" })
    .max(255, { message: "Hostel Name must be 255 characters or less" }),

  floorCount: z
    .number()
    .int()
    .positive({ message: "Floor Count must be a positive integer" })
    .min(1, { message: "Floor Count must be at least 1" })
    .max(100, { message: "Floor Count cannot exceed 100" }),

  capacity: z
    .number()
    .int()
    .positive({ message: "Capacity must be a positive integer" })
    .min(1, { message: "Capacity must be at least 1" }),

  type: z
    .string()
    .nonempty({ message: "Type is required" })
    .max(100, { message: "Type must be 100 characters or less" }),
});

// Interface extracted from Zod schema
export interface Hostel {
  id: number;
  hostelName: string;
  floorCount: number;
  capacity: number;
  type: string;
}

// Type for the input validation
export type HostelInput = z.infer<typeof HostelValidation>;

//Fee By Route Validation
export const FeeByRouteValidation = z.object({
  RouteStage: z.string().nonempty("Route Stage is required"),
  Fee1: z.string().nonempty("Fee1 is required"),
  DueDate1: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  Fee2: z.string().optional(),
  DueDate2: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  Fee3: z.string().optional(),
  DueDate3: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  Fee4: z.string().optional(),
  DueDate4: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  Fee5: z.string().optional(),
  DueDate5: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  Fee6: z.string().optional(),
  DueDate6: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  Fee7: z.string().optional(),
  DueDate7: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  Fee8: z.string().optional(),
  DueDate8: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  Fee9: z.string().optional(),
  DueDate9: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  Fee10: z.string().optional(),
  DueDate10: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  Fee11: z.string().optional(),
  DueDate11: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  Fee12: z.string().optional(),
  DueDate12: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
});

export type FeeByRouteInput = z.infer<typeof FeeByRouteValidation>;

export const FeeByHotelValidation = z.object({
  academicYearId: z
    .string()
    .nonempty({ message: "Academic Year is required" })
    .transform((value) => Number(value)),
  hostelId: z
    .string()
    .nonempty({ message: "Hostel Name is required" })
    .transform((value) => Number(value)),
  accountId: z
    .string()
    .nonempty({ message: "Account Name is required" })
    .transform((value) => Number(value)),
  term: z
    .string()
    .nonempty({ message: "Term is required" })
    .transform((value) => Number(value)),
  feeAmount: z
    .string()
    .nonempty({ message: "Amount is required" })
    .refine(
      (value) => /^[0-9]+(\.[0-9]{1,2})?$/.test(value),
      "Amount must be a valid number with up to 2 decimal places"
    )
    .transform((value) => Number(value)),
});

export type FeeByHostelInput = z.infer<typeof FeeByHotelValidation>;

//Event table
// Function to preprocess time strings (HH:MM) into Date objects
const timeStringToDate = (value: unknown) => {
  if (typeof value === "string") {
    const [hours, minutes] = value.split(":").map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const date = new Date();
      date.setHours(hours, minutes, 0, 0); // Set time with hours and minutes
      return date;
    }
  }
  return undefined; // Return undefined if invalid
};

export const eventSchema = z.object({
  type: z.string().min(1, "Event type is required"),
  eventName: z.string().min(1, "Event name is required"),
  locationName: z.string().min(1, "Location name is required"),
  date: z.preprocess((value) => new Date(value as string), z.date()),
  startTime: z.preprocess(timeStringToDate, z.date()),
  endTime: z.preprocess(timeStringToDate, z.date()),
  organizerName: z.string().min(1, "Organizer name is required"),
  description: z.string().min(1, "Description is required"),
  branchId: z
    .string()
    .nonempty({ message: "Branch is required" })
    .transform((value) => (value === "all" ? "all" : Number(value))), // Add branch validation
});

export interface Branch {
  id: number;
  label: string;
  acronym: string;
}

export interface ColumnEventFormValues {
  id: number;
  branchId: number | string;
  eventName: string;
  locationName: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  organizerName: string;
  description: string;
  type: string;
  branch: Branch;
  createdAt: string;
  updatedAt: string;
}

// Define the final validated type (after transformation)
export type EventFormValues = z.infer<typeof eventSchema>;

export const AttendanceStatusEnum = z.enum([
  "Absent",
  "Present",
  "Leave",
  "Morning Present",
  "Afternoon Present",
]);

export const AttendanceFormSchema = z.object({
  academicYearId: z
    .string()
    .min(1, "Academic Year is required")
    .transform((val) => Number(val)),
  branchId: z
    .string()
    .min(1, "Branch is required")
    .transform((val) => Number(val)),
  classId: z
    .string()
    .min(1, "Class is required")
    .transform((val) => Number(val)),
  sectionId: z
    .string()
    .min(1, "Section is required")
    .transform((val) => Number(val)),
});

export type AttendanceFormValues = z.infer<typeof AttendanceFormSchema>;

//Exam Table

export const examSchema = z.object({
  academicYear: z.string().min(1, "Academic year is required"),
  branches: z.array(z.string()).min(1, "At least one branch must be selected"),
  classes: z.array(z.string()).min(1, "At least one class must be selected"),
  sections: z.array(z.string()).min(1, "At least one section must be selected"),
});
export type ExamFormValues = z.infer<typeof examSchema>;

export const TimetableValidation = z.object({
  branch: z.string().min(1, "Academic year is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  class: z.string().min(1, "Academic year is required"),
  section: z.string().min(1, "Academic year is required"),
  teacher: z.string().min(1, "Academic year is required"),
  subject: z.string().min(1, "Academic year is required"),
  period: z.string().min(1, "Academic year is required"),
  days: z.string().min(1, "Academic year is required"),
  applicableDate: z.string().min(1, "Academic year is required"),
});
export type TimetableInput = z.infer<typeof TimetableValidation>;
