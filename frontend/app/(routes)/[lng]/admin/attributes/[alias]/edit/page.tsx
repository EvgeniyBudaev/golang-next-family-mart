import { redirect } from "next/navigation";
import { getAttributeDetail } from "@/app/api/adminPanel/attributes/detail/domain";
import { useTranslation } from "@/app/i18n";
import { AttributeEditPage } from "@/app/pages/adminPanel/attributes/edit";
import { EPermissions, ERoutes } from "@/app/shared/enums";
import { checkPermissionsByServer } from "@/app/shared/utils/permissions";
import { createPath, getResponseError } from "@/app/shared/utils";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";
import { TCommonResponseError } from "@/app/shared/types/error";
import { TAttributeDetail } from "@/app/api/adminPanel/attributes/detail/types";

type TLoader = {
  alias: string;
};

async function loader(params: TLoader) {
  try {
    const response = await getAttributeDetail(params);
    return response.data as TAttributeDetail;
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
};

export default async function AttributeEditRoute(props: TProps) {
  const { params } = props;
  const { alias, lng } = params;
  console.log("params: ", params);

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
    const attribute = await loader({ alias });
    return <AttributeEditPage attribute={attribute} i18n={{ lng, t }} />;
  } catch (error) {
    return <ErrorBoundary i18n={{ lng, t }} message={t(error.message)} />;
  }
}
