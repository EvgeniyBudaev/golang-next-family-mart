"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { attributeEditFormSchema } from "@/app/actions/adminPanel/attributes/edit/schemas";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver, createPath } from "@/app/shared/utils";
import { attributeEdit } from "@/app/api/adminPanel/attributes/edit/domain";
import { ERoutes } from "@/app/shared/enums";

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
    const path = `/ru/admin/attributes/${response.data.alias}/edit`;
    revalidatePath(`/ru/admin/attributes/${formattedParams.alias}/edit`);
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