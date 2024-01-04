import { z } from "zod";
import { paginationSchema } from "@/app/api/pagination/schemas";

export const attributeListItemSchema = z.object({
  id: z.number(),
  catalogId: z.number(),
  uuid: z.string(),
  alias: z.string(),
  name: z.string(),
  type: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDeleted: z.boolean(),
  isEnabled: z.boolean(),
  isFiltered: z.boolean(),
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
