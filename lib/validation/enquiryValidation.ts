// lib/validation.ts
import * as z from "zod";

export const enquirySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  gender: z.union([z.literal("male"), z.literal("female")]),
  dateOfBirth: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  yearOfAdmission: z.string().optional(),
  // yearOfAdmission: z
  //   .preprocess(
  //     (val) => (typeof val === "string" ? parseInt(val, 10) : val),
  //     z.number().int().positive("Year of admission must be a positive number")
  //   )
  //   .refine((val) => val >= 1900, { message: "Year should be at least 1900" }),
  admissionForGrade: z.string().min(1, "Admission for grade is required"),
  enquiredByStaff: z.string().optional(),
  communicationNo: z.string().min(1, "Communication number is required"),
  fatherNo: z.string().min(1, "Father’s contact number is required"),
  email: z.string().optional(),
  currentStudyingSchool: z.string().min(1, " required"),
  fatherName: z.string().min(1, "Father’s name is required"),
  fatherOccupation: z.string().min(1, "Father’s occupation is required"),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  state: z.string().min(1, "State is required"),
  cityTownVillage: z.string().min(1, "City/Town/Village is required"),
  status: z.string().min(1, "Enquiry status is required"),
  branch: z.string().min(1, " required"),
  address: z.string().min(1, "State is required"),
});

// Export the type inferred from the schema to use in your form handling
export type EnquiryFormValues = z.infer<typeof enquirySchema>;
