"use server";

import { revalidatePath } from "next/cache";
import { catalogAddFormSchema } from "@/app/actions/adminPanel/catalogs/add/schemas";
import { catalogAdd } from "@/app/api/adminPanel/catalogs/add/domain";
import { ERoutes } from "@/app/shared/enums";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver, createPath } from "@/app/shared/utils";
import { TCatalogAddParams } from "@/app/api/adminPanel/catalogs/add";

export async function catalogAddAction(prevState: any, formData: FormData) {
  console.log("catalogAddAction", Object.fromEntries(formData.entries()));
  const resolver = catalogAddFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!resolver.success) {
    const errors = getErrorsResolver(resolver);
    return { data: undefined, error: undefined, errors: errors, success: false };
  }

  try {
    const formattedParams = {
      ...resolver.data,
    };
    console.log("formattedParams: ", formattedParams);
    const response = await catalogAdd(formData as TCatalogAddParams);
    console.log("response: ", response);
    const path = createPath({
      route: ERoutes.AdminCatalogAdd,
    });
    revalidatePath(path);
    return { data: response.data, error: undefined, errors: undefined, success: true };
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    const { message: formError, fieldErrors } = getResponseError(responseData) ?? {};
    console.log("[formError] ", formError);
    console.log("[fieldErrors] ", fieldErrors);
    return { data: undefined, error: formError, errors: fieldErrors, success: false };
  }
}
