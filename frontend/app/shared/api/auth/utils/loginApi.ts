import { fetchApi, TApiFunction } from "@/app/shared/api";
import { TLogin, TLoginParams } from "@/app/shared/api/auth/types";
import { EFormMethods } from "@/app/shared/form";

export const loginApi: TApiFunction<TLoginParams, TLogin> = (params) => {
  return fetchApi<TLogin>(`/api/v1/auth/login`, {
    method: EFormMethods.Post,
    body: params,
  });
};
