import { fetchApi, TApiFunction } from "@/app/api";
import {
  TCatalogDeleteResponse,
  TCatalogDeleteParams,
} from "@/app/api/adminPanel/catalogs/delete/types";
import { EFormMethods } from "@/app/shared/form";

export const catalogDeleteApi: TApiFunction<TCatalogDeleteParams, TCatalogDeleteResponse> = (
  params,
) => {
  const url = `/api/v1/catalog/delete/${params.uuid}`;
  return fetchApi<TCatalogDeleteResponse>(url, {
    method: EFormMethods.Delete,
  });
};
