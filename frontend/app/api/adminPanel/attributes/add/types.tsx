import type { z } from "zod";
import {
  attributeAddSchema,
  attributeAddParamsSchema,
} from "@/app/api/adminPanel/attributes/add/schemas";

export type TAttributeAddParams = z.infer<typeof attributeAddParamsSchema>;
export type TAttributeAdd = z.infer<typeof attributeAddSchema>;
