import { redirect } from "next/navigation";
import { getCatalogList, type TCatalogList } from "@/app/api/adminPanel/catalogs/list";
import type { TSearchParams } from "@/app/api/common";
import { mapParamsToDto } from "@/app/api/common/utils";
import { useTranslation } from "@/app/i18n";
import { CatalogListPage } from "@/app/pages/adminPanel/catalogs/list";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";
import { EPermissions, ERoutes } from "@/app/shared/enums";
import { TCommonResponseError } from "@/app/shared/types/error";
import { createPath, getResponseError } from "@/app/shared/utils";
import { checkPermissionsByServer } from "@/app/shared/utils/permissions";

async function loader(searchParams: TSearchParams) {
  const paramsToDto = mapParamsToDto(searchParams);

  try {
    const response = await getCatalogList(paramsToDto);
    return response.data as TCatalogList;
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

export default async function CatalogListRoute(props: TProps) {
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
    const catalogList = await loader(searchParams);
    return <CatalogListPage list={catalogList} />;
  } catch (error) {
    return <ErrorBoundary i18n={{ lng, t }} message={t(error.message)} />;
  }
}
