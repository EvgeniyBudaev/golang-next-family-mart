import { z } from "zod";
import { attributeListItemSchema } from "@/app/api/adminPanel/attributes/list/schemas";

export const attributeDeleteParamsSchema = z.object({
  uuid: z.string(),
});

export const attributeDeleteSchema = attributeListItemSchema;
