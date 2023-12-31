"use server";

import { revalidatePath } from "next/cache";
import { catalogImageDelete } from "@/app/api/adminPanel/catalogs/deleteImage";
import { TCommonResponseError } from "@/app/shared/types/error";
import { createPath, getResponseError } from "@/app/shared/utils";
import { ERoutes } from "@/app/shared/enums";

export async function catalogDeleteImageAction(uuid: string, catalogAlias: string) {
  console.log("catalogDeleteImageAction");
  try {
    const formattedParams = {
      uuid,
    };
    const response = await catalogImageDelete(formattedParams);
    console.log("response: ", response);
    const path = createPath({
      route: ERoutes.AdminCatalogEdit,
      params: { alias: catalogAlias },
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
