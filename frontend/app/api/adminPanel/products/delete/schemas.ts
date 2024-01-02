import { z } from "zod";
import { productListItemSchema } from "@/app/api/adminPanel/products/list/schemas";

export const productDeleteParamsSchema = z.object({
  uuid: z.string(),
});

export const productDeleteResponseSchema = z.object({
  data: productListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
