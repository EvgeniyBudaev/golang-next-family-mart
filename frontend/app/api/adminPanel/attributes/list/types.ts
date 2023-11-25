import type { z } from "zod";
import {
  attributeListItemSchema,
  attributeListParamsSchema,
  attributeListResponseSchema,
  attributeListSchema,
} from "@/app/api/adminPanel/attributes/list/schemas";

export type TAttributeListParams = z.infer<typeof attributeListParamsSchema>;
export type TAttributeList = z.infer<typeof attributeListSchema>;
export type TAttributeListItem = z.infer<typeof attributeListItemSchema>;
export type TAttributeListResponse = z.infer<typeof attributeListResponseSchema>;
