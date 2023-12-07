import { fetchApi, TApiFunction } from "@/app/api";
import { TCatalogListParams, TCatalogListResponse } from "@/app/api/adminPanel/catalogs/list/types";
import { EFormMethods } from "@/app/shared/form";

export const getCatalogListApi: TApiFunction<TCatalogListParams, TCatalogListResponse> = (
  params,
) => {
  const url = `/api/v1/catalog/list?${new URLSearchParams(params)}`;
  return fetchApi<TCatalogListResponse>(url, {
    method: EFormMethods.Get,
  });
};
