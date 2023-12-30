import { z } from "zod";
import { catalogListItemSchema } from "@/app/api/adminPanel/catalogs/list/schemas";

export const catalogEditParamsSchema = z.object({
  alias: z.string(),
  enabled: z.boolean(),
  image: z.string(),
  name: z.string(),
  uuid: z.string(),
});

export const catalogEditResponseSchema = z.object({
  data: catalogListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
