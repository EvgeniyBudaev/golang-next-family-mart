"use server";

import { revalidatePath } from "next/cache";
import { signup } from "@/app/api/signup";
import { signupFormSchema } from "@/app/actions/signup/schemas";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver, normalizePhoneNumber } from "../../shared/utils";
import { mapSignupToDto } from "@/app/api/signup/utils";

export async function signupAction(prevState: any, formData: FormData) {
  const resolver = signupFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!resolver.success) {
    const errors = getErrorsResolver(resolver);
    return {
      type: "error" as const,
      errors: errors,
    };
  }

  try {
    const formattedParams = {
      ...resolver.data,
      mobileNumber: normalizePhoneNumber(resolver.data?.mobileNumber),
    };
    const mapperParams = mapSignupToDto(formattedParams);
    // console.log("[mapperParams] ", mapperParams);
    const response = await signup(mapperParams);
    console.log("[response] ", response);
    revalidatePath("/ru/signup");
    console.log("[after revalidatePath] ");
    return { error: null, data: response, success: true };
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    const { message: formError, fieldErrors, success } = getResponseError(responseData) ?? {};
    console.log("[formError] ", formError);
    console.log("[fieldErrors] ", fieldErrors);
    return { error: formError, success: false };
  }
}
