import { fetchApi, TApiFunction } from "@/app/api";
import {
  TSelectableEdit,
  TSelectableEditParams,
} from "@/app/api/adminPanel/selectables/edit/types";
import { EFormMethods } from "@/app/shared/form";

export const selectableEditApi: TApiFunction<TSelectableEditParams, TSelectableEdit> = (params) => {
  return fetchApi<TSelectableEdit>(`/api/v1/selectable/update`, {
    method: EFormMethods.Put,
    body: params,
  });
};
