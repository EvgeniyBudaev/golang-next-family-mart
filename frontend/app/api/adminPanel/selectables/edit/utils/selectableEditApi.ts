import { fetchApi, TApiFunction } from "@/app/api";
import {
  TSelectableEditResponse,
  TSelectableEditParams,
} from "@/app/api/adminPanel/selectables/edit/types";
import { EFormMethods } from "@/app/shared/form";

export const selectableEditApi: TApiFunction<TSelectableEditParams, TSelectableEditResponse> = (
  params,
) => {
  return fetchApi<TSelectableEditResponse>(`/api/v1/selectable/update`, {
    method: EFormMethods.Put,
    body: params,
  });
};
