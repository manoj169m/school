import { z } from "zod";
export const LoginValidation = z.object({
  username: z.string().nonempty("Username is required"),
  password: z.string().nonempty("Password is required"),
});

export type LoginFormValues = z.infer<typeof LoginValidation>;
