import { fetchApi, TApiFunction } from "@/app/api";
import {
  TProductImageDeleteParams,
  TProductImageDeleteResponse,
} from "@/app/api/adminPanel/products/deleteImage/types";
import { EFormMethods } from "@/app/shared/form";

export const productImageDeleteApi: TApiFunction<
  TProductImageDeleteParams,
  TProductImageDeleteResponse
> = (params) => {
  return fetchApi<TProductImageDeleteResponse>(`/api/v1/product/image/delete`, {
    method: EFormMethods.Delete,
    body: params,
  });
};
