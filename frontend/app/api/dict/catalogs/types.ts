import type { z } from "zod";
import {
  dictCatalogListItemSchema,
  dictCatalogListParamsSchema,
  dictCatalogListResponseSchema,
} from "@/app/api/dict/catalogs/schemas";

export type TDictCatalogListParams = z.infer<typeof dictCatalogListParamsSchema>;
export type TDictCatalogListItem = z.infer<typeof dictCatalogListItemSchema>;
export type TDictCatalogListResponse = z.infer<typeof dictCatalogListResponseSchema>;
