import { fetchApi, TApiFunction } from "@/app/api";
import {
  TSelectableDeleteResponse,
  TSelectableDeleteParams,
} from "@/app/api/adminPanel/selectables/delete/types";
import { EFormMethods } from "@/app/shared/form";

export const selectableDeleteApi: TApiFunction<
  TSelectableDeleteParams,
  TSelectableDeleteResponse
> = (params) => {
  return fetchApi<TSelectableDeleteResponse>(`/api/v1/selectable/delete`, {
    method: EFormMethods.Delete,
    body: params,
  });
};
