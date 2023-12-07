"use server";

import { revalidatePath } from "next/cache";
import { attributeAddFormSchema } from "@/app/actions/adminPanel/attributes/add/schemas";
import { attributeAdd } from "@/app/api/adminPanel/attributes/add/domain";
import { ERoutes } from "@/app/shared/enums";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver, createPath } from "@/app/shared/utils";

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
    console.log("[attributeAddAction formattedParams] ", formattedParams);
    const response = await attributeAdd(formattedParams);
    console.log("[attributeAddAction response] ", response);
    const path = createPath({
      route: ERoutes.AdminAttributeAdd,
    });
    revalidatePath(path);
    return { error: null, data: response.data, success: true };
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    const { message: formError, fieldErrors, success } = getResponseError(responseData) ?? {};
    console.log("[attributeAddAction formError] ", formError);
    console.log("[attributeAddAction fieldErrors] ", fieldErrors);
    return { error: formError, success: false };
  }
}
