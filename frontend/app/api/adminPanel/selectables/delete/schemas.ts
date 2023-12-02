import { z } from "zod";
import { selectableListItemSchema } from "@/app/api/adminPanel/selectables/list";

export const selectableDeleteParamsSchema = z.object({
  uuid: z.string(),
});

export const selectableDeleteSchema = selectableListItemSchema;
