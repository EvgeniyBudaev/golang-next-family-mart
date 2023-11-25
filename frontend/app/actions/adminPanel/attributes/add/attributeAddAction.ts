"use server";

import { revalidatePath } from "next/cache";
import { attributeAddFormSchema } from "@/app/actions/adminPanel/attributes/add/schemas";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver } from "@/app/shared/utils";
import { attributeAdd } from "@/app/api/adminPanel/attributes/add/domain";

export async function attributeAddAction(prevState: any, formData: FormData) {
  const resolver = attributeAddFormSchema.safeParse(Object.fromEntries(formData.entries()));

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
    };
    console.log("formattedParams: ", formattedParams);
    const response = await attributeAdd(formattedParams);
    console.log("response: ", response);
    revalidatePath("/ru/admin/attributes/add");
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
