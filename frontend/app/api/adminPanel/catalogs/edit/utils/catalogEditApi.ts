import { fetchApi, TApiFunction } from "@/app/api";
import { TCatalogEditResponse, TCatalogEditParams } from "@/app/api/adminPanel/catalogs/edit/types";
import { EFormMethods } from "@/app/shared/form";

export const catalogEditApi: TApiFunction<TCatalogEditParams, TCatalogEditResponse> = (params) => {
  return fetchApi<TCatalogEditResponse>(`/api/v1/catalog/update`, {
    method: EFormMethods.Put,
    body: params,
  });
};
