import { z } from "zod";
import { catalogListItemSchema } from "@/app/api/adminPanel/catalogs/list/schemas";

export const catalogAddParamsSchema = z.object({
  alias: z.string(),
  name: z.string(),
});

export const catalogAddResponseSchema = z.object({
  data: catalogListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
