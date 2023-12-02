import { z } from "zod";
import { selectableListItemSchema } from "@/app/api/adminPanel/selectables/list";

export const selectableEditParamsSchema = z.object({
  uuid: z.string(),
  value: z.string(),
});

export const selectableEditSchema = selectableListItemSchema;
