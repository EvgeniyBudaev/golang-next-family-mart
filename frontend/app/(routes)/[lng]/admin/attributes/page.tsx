import { redirect } from "next/navigation";
import { type TAttributeList } from "@/app/api/adminPanel/attributes/list";
import type { TSearchParams } from "@/app/api/common";
import { mapParamsToDto } from "@/app/api/common/utils";
import { useTranslation } from "@/app/i18n";
import { AttributeListPage } from "@/app/pages/adminPanel/attributes/list";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";
import { EPermissions, ERoutes } from "@/app/shared/enums";
import { checkPermissionsByServer } from "@/app/shared/utils/permissions";
import { createPath, getResponseError } from "@/app/shared/utils";
import { getAttributeList } from "@/app/api/adminPanel/attributes/list";
import { TCommonResponseError } from "@/app/shared/types/error";

async function loader(searchParams: TSearchParams) {
  const paramsToDto = mapParamsToDto(searchParams);

  try {
    const response = await getAttributeList(paramsToDto);
    return response.data as TAttributeList;
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    console.log("responseData: ", responseData);
    const { message: formError, fieldErrors, success } = getResponseError(responseData) ?? {};
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

type TProps = {
  params: { lng: string };
  searchParams: TSearchParams;
};

export default async function AttributeListRoute(props: TProps) {
  const {
    params: { lng },
    searchParams,
  } = props;

  const [{ t }, isPermissions] = await Promise.all([
    useTranslation(lng, "index"),
    checkPermissionsByServer([EPermissions.Admin]),
  ]);

  if (!isPermissions) {
    redirect(
      createPath({
        route: ERoutes.PermissionDenied,
      }),
    );
  }

  try {
    const attributeList = await loader(searchParams);
    return <AttributeListPage attributeList={attributeList} />;
  } catch (error) {
    return <ErrorBoundary i18n={{ lng, t }} message={t(error.message)} />;
  }
}
