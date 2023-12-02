import type { z } from "zod";
import {
  attributeDeleteSchema,
  attributeDeleteParamsSchema,
} from "@/app/api/adminPanel/attributes/delete/schemas";

export type TAttributeDeleteParams = z.infer<typeof attributeDeleteParamsSchema>;
export type TAttributeDelete = z.infer<typeof attributeDeleteSchema>;
