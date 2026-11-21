import * as z from "zod";

//Hostel
export const HostelSchema = z.object({
  hostel: z.string().optional(),
  hostelName: z.string().optional(),
  floorName: z.string().optional(),
});
// Export the type inferred from the schema to use in your form handling
export type HostelFormValues = z.infer<typeof HostelSchema>;

//Transport
export const TransportSchema = z.object({
  transport: z.string().min(1, "Fee category is required"),
  RouteName: z.string().optional(),
  StopName: z.string().optional(),
});
// Export the type inferred from the schema to use in your form handling
export type TransportFormValues = z.infer<typeof TransportSchema>;
