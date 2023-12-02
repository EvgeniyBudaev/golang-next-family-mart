import { fetchApi, TApiFunction } from "@/app/api";
import {
  TSelectableAddResponse,
  TSelectableAddParams,
} from "@/app/api/adminPanel/selectables/add/types";
import { EFormMethods } from "@/app/shared/form";

export const selectableAddApi: TApiFunction<TSelectableAddParams, TSelectableAddResponse> = (
  params,
) => {
  console.log("api params: ", params);
  return fetchApi<TSelectableAddResponse>(`/api/v1/selectable/create`, {
    method: EFormMethods.Post,
    body: params,
  });
};
