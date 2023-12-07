import type { z } from "zod";
import {
  catalogDetailResponseSchema,
  catalogDetailParamsSchema,
} from "@/app/api/adminPanel/catalogs/detail/schemas";
import { catalogListItemSchema } from "@/app/api/adminPanel/catalogs/list/schemas";

export type TCatalogDetailParams = z.infer<typeof catalogDetailParamsSchema>;
export type TCatalogDetailResponse = z.infer<typeof catalogDetailResponseSchema>;
export type TCatalogDetail = z.infer<typeof catalogListItemSchema>;
