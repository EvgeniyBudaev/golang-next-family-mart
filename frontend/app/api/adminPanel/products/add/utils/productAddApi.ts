import { fetchApi, TApiFunction } from "@/app/api";
import { TProductAddResponse, TProductAddParams } from "@/app/api/adminPanel/products/add/types";
import { EFormMethods } from "@/app/shared/form";

export const productAddApi: TApiFunction<TProductAddParams, TProductAddResponse> = (params) => {
  return fetchApi<TProductAddResponse>(`/api/v1/product/create`, {
    method: EFormMethods.Post,
    body: params,
  });
};
