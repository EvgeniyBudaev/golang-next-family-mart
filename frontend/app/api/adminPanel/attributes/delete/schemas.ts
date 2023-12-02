import { z } from "zod";
import {
  attributeListItemSchema,
  attributeListSchema,
} from "@/app/api/adminPanel/attributes/list/schemas";

export const attributeDeleteParamsSchema = z.object({
  uuid: z.string(),
});

export const attributeDeleteResponseSchema = z.object({
  data: attributeListSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
