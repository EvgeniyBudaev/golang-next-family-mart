import { redirect } from "next/navigation";
import { getProductDetail } from "@/app/api/adminPanel/products/detail/domain";
import { TProductDetail } from "@/app/api/adminPanel/products/detail/types";
import { TSearchParams } from "@/app/api/common";
import { mapParamsToDto } from "@/app/api/common/utils";
import { useTranslation } from "@/app/i18n";
import { ProductEditPage } from "@/app/pages/adminPanel/products/edit";
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
    const productDetailResponse = await getProductDetail({ alias });
    const productDetail = productDetailResponse.data as TProductDetail;
    return { productDetail };
  } catch (error) {
    const errorResponse = error as Response;
    const responseData: TCommonResponseError = await errorResponse.json();
    const { message: formError, fieldErrors, success } = getResponseError(responseData) ?? {};
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

type TProps = {
  params: { lng: string };
  searchParams: TSearchParams;
};

export default async function ProductEditRoute(props: TProps) {
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
    const { productDetail } = await loader({ alias, searchParams });
    return <ProductEditPage product={productDetail} i18n={{ lng, t }} />;
  } catch (error) {
    return <ErrorBoundary i18n={{ lng, t }} message={t(error.message)} />;
  }
}
