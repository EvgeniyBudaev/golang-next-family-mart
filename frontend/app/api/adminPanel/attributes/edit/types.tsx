import type { z } from "zod";
import {
  attributeEditResponseSchema,
  attributeEditParamsSchema,
} from "@/app/api/adminPanel/attributes/edit/schemas";

export type TAttributeEditParams = z.infer<typeof attributeEditParamsSchema>;
export type TAttributeEditResponse = z.infer<typeof attributeEditResponseSchema>;
