import { z } from "zod";
import {
  attributeListItemSchema,
  attributeListSchema,
} from "@/app/api/adminPanel/attributes/list/schemas";

export const attributeEditParamsSchema = z.object({
  alias: z.string(),
  name: z.string(),
  type: z.string(),
  uuid: z.string(),
});

export const attributeEditResponseSchema = z.object({
  data: attributeListSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
