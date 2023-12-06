import { z } from "zod";
import { paginationSchema } from "@/app/api/pagination/schemas";

export const catalogListItemSchema = z.object({
  id: z.number(),
  alias: z.string(),
  created_at: z.string(),
  deleted: z.boolean(),
  enabled: z.boolean(),
  name: z.string(),
  updated_at: z.string(),
  uuid: z.string(),
});

export const catalogListParamsSchema = z.object({
  limit: z.number(),
  page: z.number(),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export const catalogListSchema = paginationSchema.extend({
  content: catalogListItemSchema.array(),
});

export const catalogListResponseSchema = z.object({
  data: catalogListSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
