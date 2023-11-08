import { fetchApi, TApiFunction } from "@/app/api";
import { EFormMethods } from "@/app/shared/form";
import { TSignup, TSignupParams } from "@/app/api/signup/types";

export const signupApi: TApiFunction<TSignupParams, TSignup> = (params) => {
  return fetchApi<TSignup>(`/api/v1/user/register`, {
    method: EFormMethods.Post,
    body: params,
  });
};
