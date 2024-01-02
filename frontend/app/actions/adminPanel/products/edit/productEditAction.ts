"use server";

import { revalidatePath } from "next/cache";
import { productEditFormSchema } from "@/app/actions/adminPanel/products/edit/schemas";
import { productEdit } from "@/app/api/adminPanel/products/edit/domain";
import { TProductEditParams } from "@/app/api/adminPanel/products/edit";
import { ERoutes } from "@/app/shared/enums";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver, createPath } from "@/app/shared/utils";

export async function productEditAction(prevState: any, formData: FormData) {
  console.log("productEditAction", Object.fromEntries(formData.entries()));
  const resolver = productEditFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!resolver.success) {
    const errors = getErrorsResolver(resolver);
    return { data: undefined, error: undefined, errors: errors, success: false };
  }

  const formattedParams = {
    ...resolver.data,
  };
  console.log("formattedParams: ", formattedParams);

  try {
    const response = await productEdit(formData as TProductEditParams);
    console.log("response: ", response);
    const path = createPath({
      route: ERoutes.AdminProductEdit,
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
