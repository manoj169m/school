import {z} from 'zod'

export  const RemoveStudentSchema = z.object({
    academicYear: z.string().min(1, "State is required"),
    YearOfLeaving: z.string().min(1, "State is required"),
    DateOfLeaving:z.string().min(1, "State is required"),
    studentDetails:z.string().min(1, "State is required"),
    feeStatus: z.string().min(1, "State is required"),
    tc: z.string()
      .min(1, "TC is required"),
    tcNo: z.string()
      .min(1, "TC number is required")
     ,
    permittedBy: z.string()
  .min(1, "State is required"),
    movedTo: z.string()
    .min(1, "State is required"),
    remarks: z.string()
      .max(500, "Remarks must not exceed 500 characters")
      .optional(),
  })
  
  // Infer the type from the schema
  export type RemoveStudentFormValues = z.infer<typeof RemoveStudentSchema>