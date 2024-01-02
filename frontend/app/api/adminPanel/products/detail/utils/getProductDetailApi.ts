import { fetchApi, TApiFunction } from "@/app/api";
import {
  TProductDetailResponse,
  TProductDetailParams,
} from "@/app/api/adminPanel/products/detail/types";
import { EFormMethods } from "@/app/shared/form";

export const getProductDetailApi: TApiFunction<TProductDetailParams, TProductDetailResponse> = (
  params,
) => {
  const { alias } = params;
  const url = `/api/v1/product/alias/${alias}`;
  return fetchApi<TProductDetailResponse>(url, {
    method: EFormMethods.Get,
  });
};
