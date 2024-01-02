import { redirect } from "next/navigation";
import { getProductList, type TProductList } from "@/app/api/adminPanel/products/list";
import type { TSearchParams } from "@/app/api/common";
import { mapParamsToDto } from "@/app/api/common/utils";
import { useTranslation } from "@/app/i18n";
import { ProductListPage } from "@/app/pages/adminPanel/products/list/ProductListPage";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";
import { EPermissions, ERoutes } from "@/app/shared/enums";
import { createPath } from "@/app/shared/utils";
import { checkPermissionsByServer } from "@/app/shared/utils/permissions";

async function loader(searchParams: TSearchParams) {
  const paramsToDto = mapParamsToDto(searchParams);

  try {
    const response = await getProductList(paramsToDto);
    return response.data as TProductList;
  } catch (error) {
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

type TProps = {
  params: { lng: string };
  searchParams: TSearchParams;
};

export default async function ProductListRoute(props: TProps) {
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
    const productList = await loader(searchParams);
    return <ProductListPage list={productList} />;
  } catch (error) {
    return <ErrorBoundary i18n={{ lng, t }} message={t(error.message)} />;
  }
}
