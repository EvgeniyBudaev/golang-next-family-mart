import { z } from "zod";
import { zfd } from "zod-form-data";
import { catalogListItemSchema } from "@/app/api/adminPanel/catalogs/list/schemas";
import { fileSchema } from "@/app/api/upload";

export const catalogAddParamsSchema = zfd.formData({
  alias: zfd.text(),
  name: zfd.text(),
  image: fileSchema.or(fileSchema.array()),
});

export const catalogAddResponseSchema = z.object({
  data: catalogListItemSchema.optional(),
  message: z.string().optional(),
  statusCode: z.number(),
  success: z.boolean(),
});
