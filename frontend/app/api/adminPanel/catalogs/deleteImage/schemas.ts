import { z } from "zod";
import { catalogImageListItemSchema } from "@/app/api/adminPanel/catalogs/list/schemas";

export const catalogImageDeleteParamsSchema = z.object({
  uuid: z.string(),
});

export const catalogImageDeleteResponseSchema = z.object({
  data: catalogImageListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
