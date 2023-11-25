import { redirect } from "next/navigation";
import { useTranslation } from "@/app/i18n";
import { AttributeListPage } from "@/app/pages/adminPanel/attributes/list";
import { EPermissions, ERoutes } from "@/app/shared/enums";
import { checkPermissionsByServer } from "@/app/shared/utils/permissions";
import { createPath, getResponseError } from "@/app/shared/utils";
import { getAttributeList } from "@/app/api/adminPanel/attributes/list";
import { TCommonResponseError } from "@/app/shared/types/error";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";
import { type TAttributeList } from "@/app/api/adminPanel/attributes/list";

async function loader() {
  try {
    const response = await getAttributeList({ page: 1, limit: 10 });
    return response.data as TAttributeList;
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    const { message: formError, fieldErrors, success } = getResponseError(responseData) ?? {};
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

export default async function AttributeListRoute({ params: { lng } }: { params: { lng: string } }) {
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
    const attributeList = await loader();
    console.error("attributeList: ", attributeList);
    return <AttributeListPage attributeList={attributeList} />;
  } catch (error) {
    return <ErrorBoundary i18n={{ lng, t }} message={t(error.message)} />;
  }
}
