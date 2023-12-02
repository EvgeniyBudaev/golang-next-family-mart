import { fetchApi, TApiFunction } from "@/app/api";
import {
  TAttributeAddResponse,
  TAttributeAddParams,
} from "@/app/api/adminPanel/attributes/add/types";
import { EFormMethods } from "@/app/shared/form";

export const attributeAddApi: TApiFunction<TAttributeAddParams, TAttributeAddResponse> = (
  params,
) => {
  console.log("api params: ", params);
  return fetchApi<TAttributeAddResponse>(`/api/v1/attribute/create`, {
    method: EFormMethods.Post,
    body: params,
  });
};
