import type { z } from "zod";
import {
  attributeDetailSchema,
  attributeDetailParamsSchema,
} from "@/app/api/adminPanel/attributes/detail/schemas";

export type TAttributeDetailParams = z.infer<typeof attributeDetailParamsSchema>;
export type TAttributeDetail = z.infer<typeof attributeDetailSchema>;
