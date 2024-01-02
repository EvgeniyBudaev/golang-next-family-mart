import type { z } from "zod";
import {
  productDetailResponseSchema,
  productDetailParamsSchema,
} from "@/app/api/adminPanel/products/detail/schemas";
import { productListItemSchema } from "@/app/api/adminPanel/products/list/schemas";

export type TProductDetailParams = z.infer<typeof productDetailParamsSchema>;
export type TProductDetailResponse = z.infer<typeof productDetailResponseSchema>;
export type TProductDetail = z.infer<typeof productListItemSchema>;
