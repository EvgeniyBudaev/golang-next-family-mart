import { z } from "zod";

const tokenSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.string(),
  refreshExpiresIn: z.string(),
  refreshToken: z.string(),
  statusCode: z.number(),
  success: z.boolean(),
  tokenType: z.string(),
  userID: z.number(),
});


export const loginSchema = tokenSchema;

export const loginParamsSchema = z.object({
  email: z.string(),
  password: z.string(),
});
