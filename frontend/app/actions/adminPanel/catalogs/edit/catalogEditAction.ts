"use server";

import { revalidatePath } from "next/cache";
import { catalogEditFormSchema } from "@/app/actions/adminPanel/catalogs/edit/schemas";
import { catalogEdit } from "@/app/api/adminPanel/catalogs/edit/domain";
import { ERoutes } from "@/app/shared/enums";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver, createPath } from "@/app/shared/utils";
import { TCatalogEditParams } from "@/app/api/adminPanel/catalogs/edit";

export async function catalogEditAction(prevState: any, formData: FormData) {
  console.log("catalogEditAction", Object.fromEntries(formData.entries()));
  const resolver = catalogEditFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!resolver.success) {
    const errors = getErrorsResolver(resolver);
    return { data: undefined, error: undefined, errors: errors, success: false };
  }

  const formattedParams = {
    ...resolver.data,
  };
  console.log("formattedParams: ", formattedParams);

  try {
    const response = await catalogEdit(formData as TCatalogEditParams);
    console.log("response: ", response);
    const path = createPath({
      route: ERoutes.AdminCatalogEdit,
      params: { alias: formattedParams.alias },
    });
    revalidatePath(path);
    return { data: response.data, error: undefined, errors: undefined, success: true };
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    const { message: formError, fieldErrors, success } = getResponseError(responseData) ?? {};
    console.log("[formError] ", formError);
    console.log("[fieldErrors] ", fieldErrors);
    return { data: undefined, error: formError, errors: fieldErrors, success: false };
  }
}
