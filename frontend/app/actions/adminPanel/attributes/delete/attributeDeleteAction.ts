"use server";

import { revalidatePath } from "next/cache";
import { attributeDeleteFormSchema } from "@/app/actions/adminPanel/attributes/delete/schemas";
import { attributeDelete } from "@/app/api/adminPanel/attributes/delete/domain";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver } from "@/app/shared/utils";

export async function attributeDeleteAction(prevState: any, formData: FormData) {
  const resolver = attributeDeleteFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!resolver.success) {
    const errors = getErrorsResolver(resolver);
    return {
      type: "error" as const,
      errors: errors,
    };
  }

  try {
    const formattedParams = {
      uuid: resolver.data.uuid,
    };
    console.log("formattedParams: ", formattedParams);
    const response = await attributeDelete(formattedParams);
    console.log("response: ", response);
    revalidatePath("/ru/admin/attributes");
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
