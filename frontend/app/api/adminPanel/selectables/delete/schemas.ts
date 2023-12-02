import { z } from "zod";
import { selectableListItemSchema } from "@/app/api/adminPanel/selectables/list";

export const selectableDeleteParamsSchema = z.object({
  uuid: z.string(),
});

export const selectableDeleteResponseSchema = z.object({
  data: selectableListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
