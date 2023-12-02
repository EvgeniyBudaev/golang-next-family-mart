import { fetchApi, TApiFunction } from "@/app/api";
import {
  TAttributeDetailResponse,
  TAttributeDetailParams,
} from "@/app/api/adminPanel/attributes/detail/types";
import { EFormMethods } from "@/app/shared/form";

export const getAttributeDetailApi: TApiFunction<
  TAttributeDetailParams,
  TAttributeDetailResponse
> = (params) => {
  const { alias } = params;
  const url = `/api/v1/attribute/alias/${alias}`;
  return fetchApi<TAttributeDetailResponse>(url, {
    method: EFormMethods.Get,
  });
};
