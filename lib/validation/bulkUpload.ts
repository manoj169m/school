import { z } from 'zod';

export const studentCreationSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email().optional().nullable(),
  admissionNo: z.preprocess((val) => val?.toString(), z.string().nonempty()),
  applicationNo: z.string().optional().nullable(),
  rollNo: z.string().optional().nullable(),
  gender: z.union([z.literal("MALE"), z.literal("FEMALE"), z.literal("OTHER")]),
  placeOfBirth: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  cityTownVillage: z.string().optional(),
  address: z.string().optional(),
  communicationNo: z.preprocess((val) => val?.toString(), z.string().nonempty()),
  phoneNo: z.preprocess((val) => val?.toString(), z.string().nonempty()),
  emisNo: z.string().optional(),
  community: z.string().optional(),
  caste: z.string().optional(),
  bloodGroup: z.string().optional(),
  motherTongue: z.string().optional(),
  religion: z.string().optional(),
  relationName1: z.string(),
  relationType1: z.string(),
  relationNo1: z.preprocess((val) => val?.toString(), z.string()),
  relationName2: z.string().optional(),
  relationType2: z.string().optional(),
  relationNo2: z.preprocess((val) => val?.toString(), z.string().optional()),
  academicYear: z.preprocess((val) => val?.toString(), z.string().nonempty()),
  class: z.preprocess((val) => val?.toString(), z.string().nonempty()),
  section: z.preprocess((val) => val?.toString(), z.string().nonempty()),
  feeCategory: z.preprocess((val) => val?.toString(), z.string().nonempty()),
  branch: z.preprocess((val) => val?.toString(), z.string().nonempty()),
  dateOfJoin: z.preprocess(
    (val) => (typeof val === 'string' || val instanceof Date ? new Date(val) : undefined),
    z.date()
  ),
  dateOfBirth: z.preprocess(
    (val) => (typeof val === 'string' || val instanceof Date ? new Date(val) : undefined),
    z.date()
  ),
  aadharNo: z.preprocess(
    (val) => (typeof val === 'string' || typeof val === 'number' ? BigInt(val) : null),
    z.bigint().nullable()
  ),
  
});

export type StudentData = z.infer<typeof studentCreationSchema>;
