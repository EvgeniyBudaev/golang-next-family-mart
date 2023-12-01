import { fetchApi, TApiFunction } from "@/app/api";
import { TSelectableAdd, TSelectableAddParams } from "@/app/api/adminPanel/selectables/add/types";
import { EFormMethods } from "@/app/shared/form";

export const selectableAddApi: TApiFunction<TSelectableAddParams, TSelectableAdd> = (params) => {
  console.log("api params: ", params);
  return fetchApi<TSelectableAdd>(`/api/v1/selectable/create`, {
    method: EFormMethods.Post,
    body: params,
  });
};
