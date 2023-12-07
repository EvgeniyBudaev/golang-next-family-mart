import { z } from "zod";
import { attributeListItemSchema } from "@/app/api/adminPanel/attributes/list/schemas";

export const attributeDetailParamsSchema = z.object({
  alias: z.string(),
});

export const attributeDetailResponseSchema = z.object({
  data: attributeListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
