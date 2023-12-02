import { z } from "zod";
import { selectableListItemSchema } from "@/app/api/adminPanel/selectables/list";

export const selectableAddParamsSchema = z.object({
  attribute_id: z.number(),
  value: z.string(),
});

export const selectableAddSchema = selectableListItemSchema;
