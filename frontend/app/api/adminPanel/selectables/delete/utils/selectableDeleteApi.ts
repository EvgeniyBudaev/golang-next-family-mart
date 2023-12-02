import { fetchApi, TApiFunction } from "@/app/api";
import {
  TSelectableDelete,
  TSelectableDeleteParams,
} from "@/app/api/adminPanel/selectables/delete/types";
import { EFormMethods } from "@/app/shared/form";

export const selectableDeleteApi: TApiFunction<TSelectableDeleteParams, TSelectableDelete> = (
  params,
) => {
  return fetchApi<TSelectableDelete>(`/api/v1/selectable/delete`, {
    method: EFormMethods.Delete,
    body: params,
  });
};
