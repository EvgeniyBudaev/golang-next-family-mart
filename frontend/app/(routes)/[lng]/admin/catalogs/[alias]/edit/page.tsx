import { redirect } from "next/navigation";
import { getCatalogDetail } from "@/app/api/adminPanel/catalogs/detail/domain";
import { TCatalogDetail } from "@/app/api/adminPanel/catalogs/detail/types";
import { TSearchParams } from "@/app/api/common";
import { mapParamsToDto } from "@/app/api/common/utils";
import { useTranslation } from "@/app/i18n";
import { CatalogEditPage } from "@/app/pages/adminPanel/catalogs/edit";
import { EPermissions, ERoutes } from "@/app/shared/enums";
import { checkPermissionsByServer } from "@/app/shared/utils/permissions";
import { createPath, getResponseError } from "@/app/shared/utils";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";
import { TCommonResponseError } from "@/app/shared/types/error";

type TLoader = {
  alias: string;
  searchParams: TSearchParams;
};

async function loader(params: TLoader) {
  const { alias, searchParams } = params;
  const paramsToDto = mapParamsToDto(searchParams);

  try {
    const catalogDetailResponse = await getCatalogDetail({ alias });
    const catalogDetail = catalogDetailResponse.data as TCatalogDetail;
    return { catalogDetail };
  } catch (error) {
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

type TProps = {
  params: { lng: string };
  searchParams: TSearchParams;
};

export default async function CatalogEditRoute(props: TProps) {
  const { params, searchParams } = props;
  const { alias, lng } = params;

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
    const { catalogDetail } = await loader({ alias, searchParams });
    return <CatalogEditPage catalog={catalogDetail} i18n={{ lng, t }} />;
  } catch (error) {
    return <ErrorBoundary i18n={{ lng, t }} message={t(error.message)} />;
  }
}
