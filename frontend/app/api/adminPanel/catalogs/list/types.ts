import type { z } from "zod";
import {
  catalogListItemSchema,
  catalogListParamsSchema,
  catalogListResponseSchema,
  catalogListSchema,
  catalogImageListItemSchema,
} from "@/app/api/adminPanel/catalogs/list/schemas";

export type TCatalogListParams = z.infer<typeof catalogListParamsSchema>;
export type TCatalogList = z.infer<typeof catalogListSchema>;
export type TCatalogListItem = z.infer<typeof catalogListItemSchema>;
export type TCatalogListResponse = z.infer<typeof catalogListResponseSchema>;
export type TCatalogImageListItem = z.infer<typeof catalogImageListItemSchema>;
