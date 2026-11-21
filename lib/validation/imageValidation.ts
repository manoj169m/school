import * as z from "zod";

export const ImageSchema = z.object({
  academicYear: z.string().min(1, "Academic year is required"),
  branch: z.string().min(1, "Branch is required"),
  class: z.string().min(1, "Class is required"),
  section: z.string().min(1, "Section is required"),
});
// Export the type inferred from the schema to use in your form handling
export type ImageFormValues = z.infer<typeof ImageSchema>;
