"use server";

import { revalidatePath } from "next/cache";
import { catalogEditFormSchema } from "@/app/actions/adminPanel/catalogs/edit/schemas";
import { catalogEdit } from "@/app/api/adminPanel/catalogs/edit/domain";
import { ERoutes } from "@/app/shared/enums";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver, createPath } from "@/app/shared/utils";

export async function catalogEditAction(prevState: any, formData: FormData) {
  const resolver = catalogEditFormSchema.safeParse(Object.fromEntries(formData.entries()));

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
    const response = await catalogEdit(formattedParams);
    console.log("response: ", response);
    const path = createPath({
      route: ERoutes.AdminCatalogEdit,
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
