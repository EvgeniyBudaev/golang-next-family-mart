import { fetchApi, TApiFunction } from "@/app/api";
import { TCatalogAddResponse, TCatalogAddParams } from "@/app/api/adminPanel/catalogs/add/types";
import { EFormMethods } from "@/app/shared/form";

export const catalogAddApi: TApiFunction<TCatalogAddParams, TCatalogAddResponse> = (params) => {
  return fetchApi<TCatalogAddResponse>(`/api/v1/catalog/create`, {
    method: EFormMethods.Post,
    body: params,
  });
};
