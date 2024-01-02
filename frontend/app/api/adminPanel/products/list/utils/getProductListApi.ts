import { fetchApi, TApiFunction } from "@/app/api";
import { TProductListParams, TProductListResponse } from "@/app/api/adminPanel/products/list/types";
import { EFormMethods } from "@/app/shared/form";

export const getProductListApi: TApiFunction<TProductListParams, TProductListResponse> = (
  params,
) => {
  const url = `/api/v1/product/list?${new URLSearchParams(params)}`;
  return fetchApi<TProductListResponse>(url, {
    method: EFormMethods.Get,
  });
};
