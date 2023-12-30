import { z } from "zod";
import { catalogListItemSchema } from "@/app/api/adminPanel/catalogs/list/schemas";

export const catalogDetailParamsSchema = z.object({
  alias: z.string(),
});

export const catalogDetailResponseSchema = z.object({
  data: catalogListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
