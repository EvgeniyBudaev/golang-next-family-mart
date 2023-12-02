import { fetchApi, TApiFunction } from "@/app/api";
import {
  TAttributeEditResponse,
  TAttributeEditParams,
} from "@/app/api/adminPanel/attributes/edit/types";
import { EFormMethods } from "@/app/shared/form";

export const attributeEditApi: TApiFunction<TAttributeEditParams, TAttributeEditResponse> = (
  params,
) => {
  console.log("api params: ", params);
  return fetchApi<TAttributeEditResponse>(`/api/v1/attribute/update`, {
    method: EFormMethods.Put,
    body: params,
  });
};
