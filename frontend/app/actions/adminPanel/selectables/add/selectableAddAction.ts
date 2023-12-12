"use server";

import { revalidatePath } from "next/cache";
import { selectableAddFormSchema } from "@/app/actions/adminPanel/selectables/add/schemas";
import { selectableAdd } from "@/app/api/adminPanel/selectables/add";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver } from "@/app/shared/utils";

export async function selectableAddAction(prevState: any, formData: FormData) {
  const resolver = selectableAddFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!resolver.success) {
    const errors = getErrorsResolver(resolver);
    return { data: undefined, error: undefined, errors: errors, success: false };
  }

  try {
    const attributeAlias = resolver.data.attributeAlias;
    const formattedParams = {
      attribute_id: Number(resolver.data.attributeId),
      value: resolver.data.value,
    };
    console.log("[selectableAddAction formattedParams] ", formattedParams);
    const response = await selectableAdd(formattedParams);
    console.log("[selectableAddAction response] ", response);
    const path = `/ru/admin/attributes/${attributeAlias}/edit`;
    revalidatePath(path);
    return { data: response.data, error: undefined, errors: undefined, success: true };
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    const { message: formError, fieldErrors } = getResponseError(responseData) ?? {};
    console.log("[selectableAddAction formError] ", formError);
    console.log("[selectableAddAction fieldErrors] ", fieldErrors);
    return { data: undefined, error: formError, errors: fieldErrors, success: false };
  }
}
