"use server";

import { revalidatePath } from "next/cache";
import { productImageDelete } from "@/app/api/adminPanel/products/deleteImage";
import { TCommonResponseError } from "@/app/shared/types/error";
import { createPath, getResponseError } from "@/app/shared/utils";
import { ERoutes } from "@/app/shared/enums";

export async function productDeleteImageAction(uuid: string, productAlias: string) {
  console.log("productDeleteImageAction");
  try {
    const formattedParams = {
      uuid,
    };
    const response = await productImageDelete(formattedParams);
    console.log("response: ", response);
    const path = createPath({
      route: ERoutes.AdminProductEdit,
      params: { alias: productAlias },
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
