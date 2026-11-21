import * as z from "zod";


//Update Select validation
export const EmpUpdateSelectionSchema = z.object({
  empName: z.string().min(1, " required"),
});
// Export the type inferred from the schema to use in your form handling
export type EmpUpdateSelectionFormValues = z.infer<typeof EmpUpdateSelectionSchema>;


//Remove Select validation
export const EmpRemoveSelectionSchema = z.object({
  empName: z.string().min(1, " required"),
  dateOfLeaving: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
});
// Export the type inferred from the schema to use in your form handling
export type EmpRemoveSelectionFormValues = z.infer<typeof EmpRemoveSelectionSchema>;

// Personal
export const EmpPersonalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  dateOfBirth: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  gender: z.string().nonempty("Gender is required"),
  maritalStatus: z.string().nonempty("Marital Status is required"),
  fatherName: z.string().optional(),
  dateOfJoin: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  probationCompleteDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  bloodGroup: z.string().optional(),
  employeeCode: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  permanentAddress: z.string().min(1, "Permanent address is required"),
});
// Export the type inferred from the schema to use in your form handling
export type EmpPersonalFormValues = z.infer<typeof EmpPersonalSchema>;

//contact
export const EmpContactSchema = z.object({
  empPhoneNo: z.string().min(1, "Employee’s contact number is required"),
  empWorkPhoneNo: z
    .string()
    .min(1, "Employee’s  Work contact number is required"),
  empEmail: z.string().optional(),
  empWorkEmail: z.string().optional(),
});
// Export the type inferred from the schema to use in your form handling
export type EmpContactFormValues = z.infer<typeof EmpContactSchema>;

//Job Details
export const EmpJobSchema = z.object({
  empQualification: z.string().min(1, "Qualification details is required"),
  empDesignation: z.string().optional(),
  empDepartment: z.string().optional(),
  jobRole: z.string().nonempty(" required"),
  staffType: z.string().optional(),
  transport: z.string().min(1, "Transport is required"),
});
// Export the type inferred from the schema to use in your form handling
export type EmpJobFormValues = z.infer<typeof EmpJobSchema>;

//Reporting details
export const EmpReportSchema = z.object({
  report: z.string().optional(),
  attendanceAlert: z.string().optional(),
  communicationType: z.string().optional(),
  empWorkArea: z.string().min(1, "Employee Work Area is required"),
});
// Export the type inferred from the schema to use in your form handling
export type EmpReportingFormValues = z.infer<typeof EmpReportSchema>;

//Salary Details
export const EmpSalarySchema = z.object({
  empAccountName: z.string().optional(),
  empAccountNo: z.string().min(1, "Employee Account No is required"),
  empIfscCode: z.string().min(1, "Employee Ifsc Code is required"),
  empPfNo: z.string().min(1, "Employee Pf No is required"),
  empEsiNo: z.string().min(1, "Employee Esi No is required"),
  empPanNo: z.string().min(1, "Employee Pan No is required"),
  empAadharNo: z.string().min(1, "Employee Aadhar No is required"),
});
// Export the type inferred from the schema to use in your form handling
export type EmpSalaryFormValues = z.infer<typeof EmpSalarySchema>;

//Security Details
export const EmpSecuritySchema = z.object({
  pastFinanceEntries: z.string().optional(),
  phNoDisplay: z.string().optional(),
  studentEdit: z.string().optional(),
});
// Export the type inferred from the schema to use in your form handling
export type EmpSecurityFormValues = z.infer<typeof EmpSecuritySchema>;

export const UpdateEmpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  gender: z.string().nonempty("Gender is required"),
  maritalStatus: z.string().nonempty("Marital Status is required"),
  dateOfBirth: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  dateOfJoin: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),

  probationCompleteDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
  ),
  bloodGroup: z.string().optional(),
  employeeCode: z.string().optional(),
  empPhoneNo: z.string().min(1, "Employee’s contact number is required"),
  empWorkPhoneNo: z
    .string()
    .min(1, "Employee’s  Work contact number is required"),
  empEmail: z.string().optional(),
  empWorkEmail: z.string().optional(),
  empQualification: z.string().min(1, "Qualification details is required"),
  empDesignation: z.string().optional(),
  empDepartment: z.string().optional(),
  jobRole: z.union([z.literal("Part Year"), z.literal("Full Year")]),
  staffType: z.string().optional(),
  transport: z.string().min(1, "Transport is required"),
  fatherName: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  report: z.string().optional(),
  attendanceAlert: z.string().optional(),
  communicationType: z.string().optional(),
  empWorkArea: z.string().min(1, "Employee Work Area is required"),
  empAccountName: z.string().optional(),
  empAccountNo: z.string().min(1, "Employee Account No is required"),
  empIfscCode: z.string().min(1, "Employee Ifsc Code is required"),
  empPfNo: z.string().min(1, "Employee Pf No is required"),
  empEsiNo: z.string().min(1, "Employee Esi No is required"),
  empPanNo: z.string().min(1, "Employee Pan No is required"),
  empAadharNo: z.string().min(1, "Employee Aadhar No is required"),
  pastFinanceEntries: z.string().optional(),
  phNoDisplay: z.string().optional(),
  studentEdit: z.string().optional(),
});

// Export the type inferred from the schema to use in your form handling
export type EmpUpdateFormValues = z.infer<typeof UpdateEmpSchema>;
