import { fetchApi, TApiFunction } from "@/app/api";
import {
  TCatalogImageDeleteParams,
  TCatalogImageDeleteResponse,
} from "@/app/api/adminPanel/catalogs/deleteImage/types";
import { EFormMethods } from "@/app/shared/form";

export const catalogImageDeleteApi: TApiFunction<
  TCatalogImageDeleteParams,
  TCatalogImageDeleteResponse
> = (params) => {
  return fetchApi<TCatalogImageDeleteResponse>(`/api/v1/catalog/image/delete`, {
    method: EFormMethods.Delete,
    body: params,
  });
};
