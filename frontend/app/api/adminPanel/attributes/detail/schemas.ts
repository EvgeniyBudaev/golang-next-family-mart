import { z } from "zod";
import { attributeListSchema } from "@/app/api/adminPanel/attributes/list";

export const attributeDetailParamsSchema = z.object({
  alias: z.string(),
});

export const attributeDetailResponseSchema = z.object({
  data: attributeListSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
