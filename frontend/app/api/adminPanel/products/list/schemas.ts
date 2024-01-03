import { z } from "zod";
import { paginationSchema } from "@/app/api/pagination/schemas";

export const productImageListItemSchema = z.object({
  id: z.number(),
  productId: z.number(),
  uuid: z.string(),
  name: z.string(),
  url: z.string(),
  size: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDeleted: z.boolean(),
  isEnabled: z.boolean(),
});

export const productListItemSchema = z.object({
  id: z.number(),
  catalogId: z.number(),
  uuid: z.string(),
  alias: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDeleted: z.boolean(),
  isEnabled: z.boolean(),
  catalogAlias: z.string(),
  images: productImageListItemSchema.array().nullish(),
});

export const productListParamsSchema = z.object({
  catalog: z.string().optional(),
  limit: z.number(),
  page: z.number(),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export const productListSchema = paginationSchema.extend({
  content: productListItemSchema.array(),
});

export const productListResponseSchema = z.object({
  data: productListSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
