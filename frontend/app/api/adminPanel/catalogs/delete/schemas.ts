import { z } from "zod";
import {
  catalogListItemSchema,
  catalogListSchema,
} from "@/app/api/adminPanel/catalogs/list/schemas";

export const catalogDeleteParamsSchema = z.object({
  uuid: z.string(),
});

export const catalogDeleteResponseSchema = z.object({
  data: catalogListSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
