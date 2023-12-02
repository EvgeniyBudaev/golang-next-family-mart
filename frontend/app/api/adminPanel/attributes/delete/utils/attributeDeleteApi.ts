import { fetchApi, TApiFunction } from "@/app/api";
import {
  TAttributeDeleteResponse,
  TAttributeDeleteParams,
} from "@/app/api/adminPanel/attributes/delete/types";
import { EFormMethods } from "@/app/shared/form";

export const attributeDeleteApi: TApiFunction<TAttributeDeleteParams, TAttributeDeleteResponse> = (
  params,
) => {
  return fetchApi<TAttributeDeleteResponse>(`/api/v1/attribute/delete`, {
    method: EFormMethods.Delete,
    body: params,
  });
};
