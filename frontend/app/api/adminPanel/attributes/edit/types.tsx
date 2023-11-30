import type { z } from "zod";
import {
  attributeEditSchema,
  attributeEditParamsSchema,
} from "@/app/api/adminPanel/attributes/edit/schemas";

export type TAttributeEditParams = z.infer<typeof attributeEditParamsSchema>;
export type TAttributeEdit = z.infer<typeof attributeEditSchema>;
