import { z } from "zod";
import { productListItemSchema } from "@/app/api/adminPanel/products/list/schemas";

export const productDetailParamsSchema = z.object({
  alias: z.string(),
});

export const productDetailResponseSchema = z.object({
  data: productListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
