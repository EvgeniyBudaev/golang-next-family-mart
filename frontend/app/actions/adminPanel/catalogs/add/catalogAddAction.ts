"use server";

import { revalidatePath } from "next/cache";
import { catalogAddFormSchema } from "@/app/actions/adminPanel/catalogs/add/schemas";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver } from "@/app/shared/utils";
import { catalogAdd } from "@/app/api/adminPanel/catalogs/add/domain";

export async function catalogAddAction(prevState: any, formData: FormData) {
  const resolver = catalogAddFormSchema.safeParse(Object.fromEntries(formData.entries()));

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
    const response = await catalogAdd(formattedParams);
    console.log("response: ", response);
    revalidatePath("/ru/admin/catalogs/add");
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
