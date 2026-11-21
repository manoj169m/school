// lib/validation.ts
import * as z from "zod";

export const reservationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.union([z.literal("male"), z.literal("female")]),
  dateOfBirth: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  community: z.string().optional(),
  caste: z.string().optional(),
  studMotherTongue: z.string().optional(),
  bloodGroup: z.string().optional(),
  studReligion: z.string().optional(),
  aadharNo: z.string().optional(),
  emisNo: z.string().optional(),
  placeOfBirth: z.string().optional(),
  country: z.string().min(1, " required"),
  state: z.string().min(1, "State is required"),
  cityTownVillage: z.string().min(1, "City/Town/Village is required"),
  address: z.string().min(1, "State is required"),

  communicationNo: z.string().min(1, " required"),
  phoneNo: z.string().min(1, "contact number is required"),
  email: z.string().optional(),

  relationName1: z.string().min(1, " required"),
  relationType1: z.string().min(1, " required"),
  relationNo1: z.string().min(1, " required"),
  relationName2: z.string().optional(),
  relationType2: z.string().optional(),
  relationNo2: z.string().optional(),

  academicYear: z.string().min(1, " required"),
  branch: z.string().min(1, " required"),
  joinYear: z.string().min(1, " required"),
  dateOfJoin: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  departmentJoin: z.string().optional(),
  classJoin: z.string().min(1, " required"),
  sectionJoin: z.string().min(1, " required"),
  department: z.string().optional(),
  class: z.string().min(1, " required"),
  section: z.string().min(1, " required"),
  admissionNo: z.string().optional(),
  applicationNo: z.string().min(1, " required"),
  rollNo: z.string().optional(),

  feeCategory: z.string().min(1, " required"),
  scholarshipCategory: z.string().optional(),
  concessionCategory: z.string().optional(),

  transport: z.string().min(1, " required"),
  route: z.string().optional(),
  stage: z.string().optional(),

  hostel: z.string().min(1, " required"),
  block: z.string().optional(),
  room: z.string().optional(),

  dayorder: z.string().optional(),
  category: z.string().min(1, " required"),
});

// Export the type inferred from the schema to use in your form handling
export type ReservationFormValues = z.infer<typeof reservationSchema>;