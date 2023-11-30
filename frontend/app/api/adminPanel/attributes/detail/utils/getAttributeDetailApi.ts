import { fetchApi, TApiFunction } from "@/app/api";
import {
  TAttributeDetail,
  TAttributeDetailParams,
} from "@/app/api/adminPanel/attributes/detail/types";
import { EFormMethods } from "@/app/shared/form";

export const getAttributeDetailApi: TApiFunction<TAttributeDetailParams, TAttributeDetail> = (
  params,
) => {
  const { alias } = params;
  const url = `/api/v1/attribute/alias/${alias}`;
  return fetchApi<TAttributeDetail>(url, {
    method: EFormMethods.Get,
  });
};
