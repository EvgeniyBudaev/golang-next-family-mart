"use server";

import { revalidatePath } from "next/cache";
import { productAddFormSchema } from "@/app/actions/adminPanel/products/add/schemas";
import { productAdd } from "@/app/api/adminPanel/products/add/domain";
import { ERoutes } from "@/app/shared/enums";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver, createPath } from "@/app/shared/utils";
import { TProductAddParams } from "@/app/api/adminPanel/products/add";

export async function productAddAction(prevState: any, formData: FormData) {
  console.log("productAddAction", Object.fromEntries(formData.entries()));
  const resolver = productAddFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!resolver.success) {
    const errors = getErrorsResolver(resolver);
    return { data: undefined, error: undefined, errors: errors, success: false };
  }

  try {
    const formattedParams = {
      ...resolver.data,
    };
    console.log("formattedParams: ", formattedParams);
    const response = await productAdd(formData as TProductAddParams);
    console.log("response: ", response);
    const path = createPath({
      route: ERoutes.AdminProductAdd,
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
