// lib/validation.ts
import * as z from "zod";

export const StudentUpdateSchema = z.object({
  id: z.number().min(1, "ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  gender: z.union([z.literal("MALE"), z.literal("FEMALE"), z.literal("OTHER")]),
  dateOfBirth: z.preprocess(
    (val) => {
      if (!val) return undefined;
      const date = new Date(val as string | number | Date);
      return isNaN(date.getTime()) ? undefined : date;
    },
    z.date({
      required_error: "Date of birth is required",
      invalid_type_error: "Invalid date format",
    })
  ),
  community: z.string().optional(),
  caste: z.string().optional(),
  bloodGroup: z.string().optional(),
  motherTongue: z.string().optional(),
  religion: z.string().optional(),

  aadharNo: z.string().optional(),
  emisNo: z.string().optional(),
  placeOfBirth: z.string().optional(),

  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  cityTownVillage: z.string().min(1, "City/Town/Village is required"),
  address: z.string().min(1, "Address is required"),

  communicationNo: z.string().min(1, "Communication number is required"),
  phoneNo: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email format"),

  relationName1: z.string().min(1, "Primary relation name is required"),
  relationType1: z.string().min(1, "Primary relation type is required"),
  relationNo1: z.string().min(1, "Primary relation number is required"),

  relationName2: z.string().optional(),
  relationType2: z.string().optional(),
  relationNo2: z.string().optional(),

  academicYear: z.string().min(1, "Academic year is required"),
  branch: z.string().min(1, "Branch is required"),
  joinYear: z.string().min(1, "Join year is required"),

  dateOfJoin: z.preprocess(
    (val) => {
      if (!val) return undefined;
      const date = new Date(val as string | number | Date);
      return isNaN(date.getTime()) ? undefined : date;
    },
    z.date({
      required_error: "Date of join is required",
      invalid_type_error: "Invalid join date format",
    })
  ),

  classJoin: z.string().min(1, "Class join is required"),
  class: z.string().min(1, "Class is required"),
  section: z.string().min(1, "Section is required"),

  admissionNo: z.string().min(1, "Admission number is required"),
  applicationNo: z.string().optional(),
  rollNo: z.string().optional(),

  feeCategory: z.string().min(1, "Fee category is required"),

  transport: z.string().min(1, "Fee category is required"),
  routeName: z.string().optional(),
  stopName: z.string().optional(),

  hostel: z.string().optional(),
  hostelName: z.string().optional(),
  floorName: z.string().optional(),
});

// Export the type inferred from the schema to use in your form handling
export type StudentUpdateFormValues = z.infer<typeof StudentUpdateSchema>;

//StudentParentFormValues
export const studentParentSchema = z.object({
  mriNo: z.string().optional(),
  abcNo: z.string().optional(),
  height: z.string().optional(),
  identificationMark: z.string().optional(),
  weight: z.string().optional(),
  leftEyeSight: z.string().optional(),
  rightEyeSight: z.string().optional(),
  leftEar: z.string().optional(),
  rightEar: z.string().optional(),

  fatherOccupation: z.string().optional(),
  fatherIncome: z.string().optional(),
  fatherWorkPlace: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherIncome: z.string().optional(),
  motherWorkPlace: z.string().optional(),
});

// Export the type inferred from the schema to use in your form handling
export type StudentParentFormValues = z.infer<typeof studentParentSchema>;

//preQualificationSchema
export const preQualificationSchema = z.object({
  institutionName: z.string().min(1, " required"),
  tcNo: z.string().min(1, " required"),
  year: z.string().min(1, " required"),
  place: z.string().min(1, " required"),
  remarks: z.string().optional(),

  schoolLastStudied: z.string().min(1, " required"),
  classLastStudied: z.string().min(1, " required"),
  acadLastStudied: z.string().optional(),
  area: z.string().optional(),
  hallTicketNo: z.string().optional(),
  scanCopy: z.string().optional(),
  lastStudiedGroup: z.string().optional(),
  percentage: z.string().min(1, " required"),
  mark: z.string().min(1, " required"),

  courseName1: z.string().min(1, " required"),
  courseDuration1: z.string().min(1, " required"),
  coursePlace1: z.string().optional(),
  courseStatus1: z.string().optional(),
  scoredMarkOrPercentage1: z.string().min(1, " required"),
  courseInstituitionName1: z.string().optional(),

  courseName2: z.string().min(1, " required"),
  courseDuration2: z.string().min(1, " required"),
  coursePlace2: z.string().optional(),
  courseStatus2: z.string().optional(),
  scoredMarkOrPercentage2: z.string().min(1, " required"),
  courseInstituitionName2: z.string().optional(),
});

// Export the type inferred from the schema to use in your form handling
export type PreQualificationFormValues = z.infer<typeof preQualificationSchema>;

//Activities
export const studentActivitiesSchema = z.object({
  activityName: z.string().optional(),
  activityConductedBy: z.string().optional(),
  date: z.string().optional(),
  place: z.string().optional(),
  price: z.string().optional(),
  scanCopy: z.string().optional(),

  sportName: z.string().optional(),
  conductedBy: z.string().optional(),
  level: z.string().optional(),
  sportDate: z.string().optional(),
  sportPlace: z.string().optional(),
  sportPrice: z.string().optional(),
  sportScanCopy: z.string().optional(),
});

// Export the type inferred from the schema to use in your form handling
export type StudentActivitiesFormValues = z.infer<
  typeof studentActivitiesSchema
>;

//Activities
export const studentCertificatesSchema = z.object({
  certificateName: z.string().min(1, " required"),
  submittedDate: z.string().optional(),
  submittedBy: z.string().optional(),
  pCertificateName: z.string().min(1, " required"),
  pSubmittedDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  pSubmittedBy: z.string().optional(),
  cCertificateName: z.string().min(1, " required"),
  cSubmittedDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  cSubmittedBy: z.string().optional(),
});

// Export the type inferred from the schema to use in your form handling
export type StudentCertficatesFormValues = z.infer<
  typeof studentCertificatesSchema
>;
