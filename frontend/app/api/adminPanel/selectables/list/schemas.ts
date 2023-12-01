import { z } from "zod";
import { paginationSchema } from "@/app/api/pagination/schemas";

export const selectableListItemSchema = z.object({
  id: z.number(),
  attribute_id: z.number(),
  created_at: z.string(),
  deleted: z.boolean(),
  enabled: z.boolean(),
  updated_at: z.string(),
  uuid: z.string(),
  value: z.string(),
});

export const selectableListParamsSchema = z.object({
  attributeId: z.number(),
  limit: z.number(),
  page: z.number(),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export const selectableListSchema = paginationSchema.extend({
  content: selectableListItemSchema.array(),
});

export const selectableListResponseSchema = z.object({
  data: selectableListSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
