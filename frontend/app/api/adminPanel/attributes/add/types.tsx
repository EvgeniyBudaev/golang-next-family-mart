import type { z } from "zod";
import {
  attributeAddResponseSchema,
  attributeAddParamsSchema,
} from "@/app/api/adminPanel/attributes/add/schemas";

export type TAttributeAddParams = z.infer<typeof attributeAddParamsSchema>;
export type TAttributeAddResponse = z.infer<typeof attributeAddResponseSchema>;
