"use server";

import { revalidatePath } from "next/cache";
import { signup } from "@/app/api/signup";
import { signupFormSchema } from "@/app/actions/signup/schemas";
import { TCommonResponseError } from "@/app/types/error";
import { getResponseError, getErrorsResolver, normalizePhoneNumber } from "@/app/utils";
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
    console.log("[resolver.data] ", resolver.data);
    const formattedParams = {
      ...resolver.data,
      phone: normalizePhoneNumber(resolver.data?.mobileNumber),
    };
    const mapperParams = mapSignupToDto(formattedParams);
    // console.log("[mapperParams] ", mapperParams);
    // const response = await signup(mapperParams);
    revalidatePath("/ru/signup");
    // return { error: null, data: response.data, success: true };
    return { error: null, data: mapperParams, success: true };
  } catch (error) {
    console.log("[error] ", error);
    // const errorResponse = error as Response;
    // const responseData: TCommonResponseError = await errorResponse.json();
    // console.log("[responseData1] ", responseData);
    // console.log("[responseData2] ", getResponseError(responseData));
    // const { message: formError, fieldErrors, success } = getResponseError(responseData) ?? {};
    // return { error: formError, success: false };
    return { error: {}, success: false };
  }
}
