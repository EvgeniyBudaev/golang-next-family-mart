import { z } from "zod";

export const signupSchema = z.any();

export const signupSchemaSchema = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  mobileNumber: z.string(),
  password: z.string(),
  userName: z.string(),
});
