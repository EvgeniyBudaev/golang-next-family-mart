import { useTranslation } from "@/app/i18n";
import { LoginPage } from "@/app/pages/loginPage";

export default async function LoginRoute({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, "index");

  return <LoginPage i18n={{ lng, t }} />;
}
