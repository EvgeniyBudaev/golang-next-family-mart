import { fetchApi, TApiFunction } from "@/app/api";
import {
  TCatalogDeleteResponse,
  TCatalogDeleteParams,
} from "@/app/api/adminPanel/catalogs/delete/types";
import { EFormMethods } from "@/app/shared/form";

export const catalogDeleteApi: TApiFunction<TCatalogDeleteParams, TCatalogDeleteResponse> = (
  params,
) => {
  return fetchApi<TCatalogDeleteResponse>(`/api/v1/catalog/delete`, {
    method: EFormMethods.Delete,
    body: params,
  });
};
