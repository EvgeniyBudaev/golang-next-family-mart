import { z } from "zod";
import { productImageListItemSchema } from "@/app/api/adminPanel/products/list/schemas";

export const productImageDeleteParamsSchema = z.object({
  uuid: z.string(),
});

export const productImageDeleteResponseSchema = z.object({
  data: productImageListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
