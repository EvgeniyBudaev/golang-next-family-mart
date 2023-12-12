"use server";

import { revalidatePath } from "next/cache";
import { selectableEditFormSchema } from "@/app/actions/adminPanel/selectables/edit/schemas";
import { selectableEdit } from "@/app/api/adminPanel/selectables/edit";
import { TCommonResponseError } from "@/app/shared/types/error";
import { getResponseError, getErrorsResolver } from "@/app/shared/utils";

export async function selectableEditAction(prevState: any, formData: FormData) {
  const resolver = selectableEditFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!resolver.success) {
    const errors = getErrorsResolver(resolver);
    return { data: undefined, error: undefined, errors: errors, success: false };
  }

  try {
    const attributeAlias = resolver.data.attributeAlias;
    const formattedParams = {
      uuid: resolver.data.uuid,
      value: resolver.data.value,
    };
    console.log("formattedParams: ", formattedParams);
    const response = await selectableEdit(formattedParams);
    console.log("response: ", response);
    const path = `/ru/admin/attributes/${attributeAlias}/edit`;
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
