import { z } from "zod";

const tokenSchema = z.any();

export const loginSchema = tokenSchema;

export const loginParamsSchema = z.object({
  email: z.string(),
  password: z.string(),
});
