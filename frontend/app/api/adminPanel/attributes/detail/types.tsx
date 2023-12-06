import type { z } from "zod";
import {
  attributeDetailResponseSchema,
  attributeDetailParamsSchema,
} from "@/app/api/adminPanel/attributes/detail/schemas";
import { attributeListItemSchema } from "@/app/api/adminPanel/attributes/list/schemas";

export type TAttributeDetailParams = z.infer<typeof attributeDetailParamsSchema>;
export type TAttributeDetailResponse = z.infer<typeof attributeDetailResponseSchema>;
export type TAttributeDetail = z.infer<typeof attributeListItemSchema>;
