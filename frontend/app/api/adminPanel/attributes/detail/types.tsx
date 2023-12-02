import type { z } from "zod";
import {
  attributeDetailResponseSchema,
  attributeDetailParamsSchema,
} from "@/app/api/adminPanel/attributes/detail/schemas";

export type TAttributeDetailParams = z.infer<typeof attributeDetailParamsSchema>;
export type TAttributeDetailResponse = z.infer<typeof attributeDetailResponseSchema>;
