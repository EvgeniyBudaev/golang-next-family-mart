import { z } from "zod";

export const paginationSchema = z.object({
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
  limit: z.number(),
  totalItems: z.number(),
});

export const paginationParamsSchema = z.object({
  limit: z.string(),
  page: z.string(),
});
