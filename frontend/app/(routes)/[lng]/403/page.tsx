import { useTranslation } from "@/app/i18n";
import { ErrorBoundary } from "@/app/shared/components/errorBoundary";

export default async function PermissionDenied({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, "index");

  return <ErrorBoundary i18n={{ lng, t }} message={t("errorBoundary.common.forbidden")} />;
}
