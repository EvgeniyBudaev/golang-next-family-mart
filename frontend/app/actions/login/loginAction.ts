"use server";

import { revalidatePath } from "next/cache";
import { loginFormSchema } from "@/app/actions/login/schemas";
import { login } from "@/app/shared/api/auth";
import { TCommonResponseError } from "@/app/types/error";
import { getResponseError, getErrorsResolver } from "@/app/utils";

export async function loginAction(prevState: any, formData: FormData) {
  const resolver = loginFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!resolver.success) {
    const errors = getErrorsResolver(resolver);
    return {
      type: "error" as const,
      errors: errors,
    };
  }

  try {
    const loginResponse = await login(resolver.data);
    revalidatePath("/ru/login");
    return { error: null, data: loginResponse, success: true };
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    const { message: formError, fieldErrors, success } = (getResponseError(responseData)) ?? {};
    return { error: formError, success: false };
  }
}
