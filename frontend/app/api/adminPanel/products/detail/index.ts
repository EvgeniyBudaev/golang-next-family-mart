import { getProductDetail } from "./domain";
import { productDetailParamsSchema, productDetailResponseSchema } from "./schemas";
import type { TProductDetail, TProductDetailParams, TProductDetailResponse } from "./types";

export {
  getProductDetail,
  productDetailParamsSchema,
  productDetailResponseSchema,
  type TProductDetail,
  type TProductDetailParams,
  type TProductDetailResponse,
};
