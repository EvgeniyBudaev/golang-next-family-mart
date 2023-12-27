import { z } from "zod";
import { paginationSchema } from "@/app/api/pagination/schemas";

const catalogImageListItemSchema = z.object({
  id: z.number(),
  catalogId: z.number(),
  uuid: z.string(),
  name: z.string(),
  url: z.string(),
  size: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDeleted: z.boolean(),
  isEnabled: z.boolean(),
});

export const catalogListItemSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  alias: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDeleted: z.boolean(),
  isEnabled: z.boolean(),
  defaultImages: catalogImageListItemSchema.array().nullish(),
  images: catalogImageListItemSchema.array().nullish(),
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
