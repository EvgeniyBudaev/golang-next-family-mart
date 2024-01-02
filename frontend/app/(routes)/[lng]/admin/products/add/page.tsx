import { redirect } from "next/navigation";
import { useTranslation } from "@/app/i18n";
import { ProductAddPage } from "@/app/pages/adminPanel/products/add";
import { EPermissions, ERoutes } from "@/app/shared/enums";
import { createPath } from "@/app/shared/utils";
import { checkPermissionsByServer } from "@/app/shared/utils/permissions";
import { getDictCatalogList, TDictCatalogListItem } from "@/app/api/dict/catalogs";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";

async function loader() {
  try {
    const response = await getDictCatalogList({});
    return response.data as TDictCatalogListItem[];
  } catch (error) {
    throw new Error("errorBoundary.common.unexpectedError");
  }
}

export default async function ProductAddRoute({ params: { lng } }: { params: { lng: string } }) {
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
    const dictCatalogList = await loader();
    return <ProductAddPage dictCatalogList={dictCatalogList} i18n={{ lng, t }} />;
  } catch (error) {
    return <ErrorBoundary i18n={{ lng, t }} message={t(error.message)} />;
  }
}
