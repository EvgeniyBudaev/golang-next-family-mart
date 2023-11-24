import { fetchApi, TApiFunction } from "@/app/api";
import { TAttributeAdd, TAttributeAddParams } from "@/app/api/adminPanel/attributes/add/types";
import { EFormMethods } from "@/app/shared/form";

export const attributeAddApi: TApiFunction<TAttributeAddParams, TAttributeAdd> = (params) => {
  return fetchApi<TAttributeAdd>(`/api/v1/attribute/create`, {
    method: EFormMethods.Post,
    body: params,
  });
};
