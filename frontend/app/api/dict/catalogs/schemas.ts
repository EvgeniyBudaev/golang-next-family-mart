import { z } from "zod";

export const dictCatalogListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const dictCatalogListParamsSchema = z.object({});

export const dictCatalogListResponseSchema = z.object({
  data: dictCatalogListItemSchema.array(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
