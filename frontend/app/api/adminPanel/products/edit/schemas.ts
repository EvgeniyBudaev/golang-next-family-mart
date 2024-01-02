import { z } from "zod";
import { zfd } from "zod-form-data";
import { productListItemSchema } from "@/app/api/adminPanel/products/list/schemas";
import { fileSchema } from "@/app/api/upload";

export const productEditParamsSchema = zfd.formData({
  uuid: zfd.text(),
  alias: zfd.text(),
  name: zfd.text(),
  isEnabled: zfd.text(),
  image: fileSchema.or(fileSchema.array()).nullish(),
});

export const productEditResponseSchema = z.object({
  data: productListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
