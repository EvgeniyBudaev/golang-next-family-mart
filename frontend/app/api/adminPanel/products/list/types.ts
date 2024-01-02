import type { z } from "zod";
import {
  productListItemSchema,
  productListParamsSchema,
  productListResponseSchema,
  productListSchema,
  productImageListItemSchema,
} from "@/app/api/adminPanel/products/list/schemas";

export type TProductListParams = z.infer<typeof productListParamsSchema>;
export type TProductList = z.infer<typeof productListSchema>;
export type TProductListItem = z.infer<typeof productListItemSchema>;
export type TProductListResponse = z.infer<typeof productListResponseSchema>;
export type TProductImageListItem = z.infer<typeof productImageListItemSchema>;
