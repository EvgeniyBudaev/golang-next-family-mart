import { z } from "zod";
import { selectableListItemSchema } from "@/app/api/adminPanel/selectables/list";

export const selectableAddParamsSchema = z.object({
  attribute_id: z.number(),
  value: z.string(),
});

export const selectableAddResponseSchema = z.object({
  data: selectableListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
