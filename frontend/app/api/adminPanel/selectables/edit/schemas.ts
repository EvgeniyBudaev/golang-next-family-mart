import { z } from "zod";
import { selectableListItemSchema } from "@/app/api/adminPanel/selectables/list";

export const selectableEditParamsSchema = z.object({
  uuid: z.string(),
  value: z.string(),
});

export const selectableEditResponseSchema = z.object({
  data: selectableListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
