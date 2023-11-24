import { useTranslation } from "@/app/i18n";
import { AdminPage } from "@/app/pages/adminPanel/adminPage";
import { EPermissions, ERoutes } from "@/app/shared/enums";
import { checkPermissionsByServer } from "@/app/shared/utils/permissions";
import { redirect } from "next/navigation";
import { createPath } from "@/app/shared/utils";

export default async function AdminRoute({ params: { lng } }: { params: { lng: string } }) {
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

  return <AdminPage i18n={{ lng, t }} />;
}
