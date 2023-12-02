import { z } from "zod";
import {
  attributeListItemSchema,
  attributeListSchema,
} from "@/app/api/adminPanel/attributes/list/schemas";

export const attributeAddParamsSchema = z.object({
  alias: z.string(),
  name: z.string(),
  type: z.string(),
});

export const attributeAddResponseSchema = z.object({
  data: attributeListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
