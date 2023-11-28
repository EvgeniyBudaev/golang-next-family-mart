import { z } from "zod";
import { paginationSchema } from "@/app/api/pagination/schemas";

export const attributeListItemSchema = z.object({
  id: z.number(),
  alias: z.string(),
  created_at: z.string(),
  deleted: z.boolean(),
  enabled: z.boolean(),
  filtered: z.boolean(),
  name: z.string(),
  type: z.string(),
  updated_at: z.string(),
  uuid: z.string(),
});

export const attributeListParamsSchema = z.object({
  limit: z.number(),
  page: z.number(),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export const attributeListSchema = paginationSchema.extend({
  content: attributeListItemSchema.array(),
});

export const attributeListResponseSchema = z.object({
  data: attributeListSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
