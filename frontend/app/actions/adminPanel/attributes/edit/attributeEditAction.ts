"use server";

import { revalidatePath } from "next/cache";
import { attributeEditFormSchema } from "@/app/actions/adminPanel/attributes/edit/schemas";
import { attributeEdit } from "@/app/api/adminPanel/attributes/edit/domain";
import { ERoutes } from "@/app/shared/enums";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver, createPath } from "@/app/shared/utils";

export async function attributeEditAction(prevState: any, formData: FormData) {
  const resolver = attributeEditFormSchema.safeParse(Object.fromEntries(formData.entries()));

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
    const response = await attributeEdit(formattedParams);
    console.log("response: ", response);
    const path = createPath({
      route: ERoutes.AdminAttributeEdit,
      params: { alias: formattedParams.alias },
    });
    revalidatePath(path);
    return { error: null, data: response.data, success: true };
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    const { message: formError, fieldErrors, success } = getResponseError(responseData) ?? {};
    console.log("[formError] ", formError);
    console.log("[fieldErrors] ", fieldErrors);
    return { error: formError, success: false };
  }
}
