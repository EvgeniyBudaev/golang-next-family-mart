import { z } from "zod";
import { zfd } from "zod-form-data";
import { catalogListItemSchema } from "@/app/api/adminPanel/catalogs/list/schemas";
import { fileSchema } from "@/app/api/upload";

export const catalogEditParamsSchema = zfd.formData({
  alias: zfd.text(),
  name: zfd.text(),
  // enabled: z.boolean(),
  image: fileSchema.or(fileSchema.array()).nullish(),
  uuid: zfd.text(),
});

export const catalogEditResponseSchema = z.object({
  data: catalogListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
