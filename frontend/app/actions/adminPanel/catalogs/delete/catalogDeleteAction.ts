"use server";

import { revalidatePath } from "next/cache";
import { catalogDeleteFormSchema } from "@/app/actions/adminPanel/catalogs/delete/schemas";
import { catalogDelete } from "@/app/api/adminPanel/catalogs/delete/domain";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver, createPath } from "@/app/shared/utils";
import { ERoutes } from "@/app/shared/enums";

export async function catalogDeleteAction(prevState: any, formData: FormData) {
  const resolver = catalogDeleteFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!resolver.success) {
    const errors = getErrorsResolver(resolver);
    return { data: undefined, error: undefined, errors: errors, success: false };
  }

  try {
    const formattedParams = {
      uuid: resolver.data.uuid,
    };
    console.log("formattedParams: ", formattedParams);
    const response = await catalogDelete(formattedParams);
    console.log("response: ", response);
    const path = createPath({
      route: ERoutes.AdminCatalogs,
    });
    revalidatePath(path);
    return { data: response.data, error: undefined, errors: undefined, success: true };
    // return { data: undefined, error: undefined, errors: undefined, success: true };
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    const { message: formError, fieldErrors, success } = getResponseError(responseData) ?? {};
    console.log("[formError] ", formError);
    console.log("[fieldErrors] ", fieldErrors);
    return { data: undefined, error: formError, errors: fieldErrors, success: false };
  }
}
