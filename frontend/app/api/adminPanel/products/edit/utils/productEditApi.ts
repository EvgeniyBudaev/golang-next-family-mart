import { fetchApi, TApiFunction } from "@/app/api";
import { TProductEditResponse, TProductEditParams } from "@/app/api/adminPanel/products/edit/types";
import { EFormMethods } from "@/app/shared/form";

export const productEditApi: TApiFunction<TProductEditParams, TProductEditResponse> = (params) => {
  return fetchApi<TProductEditResponse>(`/api/v1/product/update`, {
    method: EFormMethods.Put,
    body: params,
  });
};
