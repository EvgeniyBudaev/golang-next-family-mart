import { z } from "zod";
import { zfd } from "zod-form-data";
import { productListItemSchema } from "@/app/api/adminPanel/products/list/schemas";
import { fileSchema } from "@/app/api/upload";

export const productAddParamsSchema = zfd.formData({
  catalogId: zfd.text(),
  alias: zfd.text(),
  name: zfd.text(),
  image: fileSchema.or(fileSchema.array()),
});

export const productAddResponseSchema = z.object({
  data: productListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
