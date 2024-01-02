import { fetchApi, TApiFunction } from "@/app/api";
import { TDictCatalogListParams, TDictCatalogListResponse } from "@/app/api/dict/catalogs/types";
import { EFormMethods } from "@/app/shared/form";

export const getDictCatalogListApi: TApiFunction<
  TDictCatalogListParams,
  TDictCatalogListResponse
> = (params) => {
  const url = "/api/v1/dict/catalog/list";
  return fetchApi<TDictCatalogListResponse>(url, {
    method: EFormMethods.Get,
  });
};
