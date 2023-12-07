"use server";

import { revalidatePath } from "next/cache";
import { catalogDeleteFormSchema } from "@/app/actions/adminPanel/catalogs/delete/schemas";
import { catalogDelete } from "@/app/api/adminPanel/catalogs/delete/domain";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver } from "@/app/shared/utils";

export async function catalogDeleteAction(prevState: any, formData: FormData) {
  const resolver = catalogDeleteFormSchema.safeParse(Object.fromEntries(formData.entries()));

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
    const response = await catalogDelete(formattedParams);
    console.log("response: ", response);
    revalidatePath("/ru/admin/catalogs");
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
