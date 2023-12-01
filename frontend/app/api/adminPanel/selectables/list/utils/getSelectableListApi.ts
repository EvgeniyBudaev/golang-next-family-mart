import { fetchApi, TApiFunction } from "@/app/api";
import {
  TSelectableListParams,
  TSelectableListResponse,
} from "@/app/api/adminPanel/selectables/list/types";
import { EFormMethods } from "@/app/shared/form";

export const getSelectableListApi: TApiFunction<TSelectableListParams, TSelectableListResponse> = (
  params,
) => {
  const { attributeId, ...queryParams } = params;
  const url = `/api/v1/attribute/${attributeId}/selectable/list?${new URLSearchParams(
    queryParams,
  )}`;
  return fetchApi<TSelectableListResponse>(url, {
    method: EFormMethods.Get,
  });
};
