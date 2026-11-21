import * as z from "zod";



export const selectUpdateSchema = z.object({
  branch: z.string().min(1, "required"),
  academicyear: z.string().min(1, " required"),
  status: z.string().min(1, " required"),
  select_student: z.string().min(1, " required"),
});

// Export the type inferred from the schema to use in your form handling
export type UpdateSelectionFormValues = z.infer<typeof selectUpdateSchema>;


export const selectStudentRemoveSchema = z.object({
  academicYear: z.string().optional(),
  branch: z.string().min(1, "required"),
  studentStatus: z.string().min(1, " required"),
  student: z.string().min(1, " required"),
  feeStatus: z.string().optional(),
  dateOfLeaving: z.string().optional(),
  tc: z.string().min(1, " required"),
  tcNo: z.string().min(1, " required"),
  remarks: z.string().min(1, " required"),
  movedTo: z.string().min(1, " required"),
  permittedBy: z.string().optional(),
});

// Export the type inferred from the schema to use in your form handling
export type StudentRemoveSelectionForm = z.infer<typeof selectStudentRemoveSchema>;


