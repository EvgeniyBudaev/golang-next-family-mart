import { fetchApi, TApiFunction } from "@/app/api";
import {
  TAttributeDelete,
  TAttributeDeleteParams,
} from "@/app/api/adminPanel/attributes/delete/types";
import { EFormMethods } from "@/app/shared/form";

export const attributeDeleteApi: TApiFunction<TAttributeDeleteParams, TAttributeDelete> = (
  params,
) => {
  return fetchApi<TAttributeDelete>(`/api/v1/attribute/delete`, {
    method: EFormMethods.Delete,
    body: params,
  });
};
