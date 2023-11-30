import { fetchApi, TApiFunction } from "@/app/api";
import { TAttributeEdit, TAttributeEditParams } from "@/app/api/adminPanel/attributes/edit/types";
import { EFormMethods } from "@/app/shared/form";

export const attributeEditApi: TApiFunction<TAttributeEditParams, TAttributeEdit> = (params) => {
  console.log("api params: ", params);
  return fetchApi<TAttributeEdit>(`/api/v1/attribute/update`, {
    method: EFormMethods.Put,
    body: params,
  });
};
