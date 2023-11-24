import { Error } from "@/app/shared/components/error";
import { useTranslation } from "@/app/i18n";

export default async function PermissionDenied({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, "index");

  return <Error i18n={{ lng, t }} message={t("errorBoundary.common.forbidden")} />;
}
