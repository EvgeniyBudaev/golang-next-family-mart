import { fetchApi, TApiFunction } from "@/app/api";
import {
  TCatalogDetailResponse,
  TCatalogDetailParams,
} from "@/app/api/adminPanel/catalogs/detail/types";
import { EFormMethods } from "@/app/shared/form";

export const getCatalogDetailApi: TApiFunction<TCatalogDetailParams, TCatalogDetailResponse> = (
  params,
) => {
  const { alias } = params;
  const url = `/api/v1/catalog/alias/${alias}`;
  return fetchApi<TCatalogDetailResponse>(url, {
    method: EFormMethods.Get,
  });
};
