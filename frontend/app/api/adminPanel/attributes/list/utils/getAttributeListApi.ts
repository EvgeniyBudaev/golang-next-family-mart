import { fetchApi, TApiFunction } from "@/app/api";
import {
  TAttributeListParams,
  TAttributeListResponse,
} from "@/app/api/adminPanel/attributes/list/types";
import { EFormMethods } from "@/app/shared/form";

export const getAttributeListApi: TApiFunction<TAttributeListParams, TAttributeListResponse> = (
  params,
) => {
  const url = `/api/v1/attribute/list?${new URLSearchParams(params)}`;
  return fetchApi<TAttributeListResponse>(url, {
    method: EFormMethods.Get,
  });
};
