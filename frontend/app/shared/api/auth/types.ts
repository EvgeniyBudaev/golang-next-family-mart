import type { z } from "zod";
import { loginParamsSchema, loginSchema } from "@/app/shared/api/auth/schemas";

export type TLoginParams = z.infer<typeof loginParamsSchema>;
export type TLogin = z.infer<typeof loginSchema>;
