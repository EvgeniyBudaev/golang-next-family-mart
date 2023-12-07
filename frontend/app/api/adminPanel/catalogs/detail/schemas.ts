import { z } from "zod";
import { catalogListSchema } from "@/app/api/adminPanel/catalogs/list";

export const catalogDetailParamsSchema = z.object({
  alias: z.string(),
});

export const catalogDetailResponseSchema = z.object({
  data: catalogListSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
