import { redirect } from "next/navigation";
import { useTranslation } from "@/app/i18n";
import { CatalogAddPage } from "@/app/pages/adminPanel/catalogs/add";
import { EPermissions, ERoutes } from "@/app/shared/enums";
import { checkPermissionsByServer } from "@/app/shared/utils/permissions";
import { createPath } from "@/app/shared/utils";

export default async function CatalogAddRoute({ params: { lng } }: { params: { lng: string } }) {
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

  return <CatalogAddPage i18n={{ lng, t }} />;
}
