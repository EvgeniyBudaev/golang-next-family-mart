import type { z } from "zod";
import { signupSchema, signupSchemaSchema } from "@/app/api/signup/schemas";

export type TSignupParams = z.infer<typeof signupSchemaSchema>;
export type TSignup = z.infer<typeof signupSchema>;
