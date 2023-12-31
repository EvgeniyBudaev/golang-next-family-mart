import type { z } from "zod";
import {
  catalogImageDeleteParamsSchema,
  catalogImageDeleteResponseSchema,
} from "@/app/api/adminPanel/catalogs/deleteImage/schemas";

export type TCatalogImageDeleteParams = z.infer<typeof catalogImageDeleteParamsSchema>;
export type TCatalogImageDeleteResponse = z.infer<typeof catalogImageDeleteResponseSchema>;
