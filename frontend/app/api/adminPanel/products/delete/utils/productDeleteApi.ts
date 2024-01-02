import { fetchApi, TApiFunction } from "@/app/api";
import {
  TProductDeleteResponse,
  TProductDeleteParams,
} from "@/app/api/adminPanel/products/delete/types";
import { EFormMethods } from "@/app/shared/form";

export const productDeleteApi: TApiFunction<TProductDeleteParams, TProductDeleteResponse> = (
  params,
) => {
  const url = `/api/v1/product/delete`;
  return fetchApi<TProductDeleteResponse>(url, {
    method: EFormMethods.Delete,
    body: params,
  });
};
