import { useTranslation } from "@/app/i18n";
import { SignupPage } from "@/app/pages/signupPage";

export default async function SignupRoute({ params: { lng } }: { params: { lng: string } }) {
  const { t } = await useTranslation(lng, "index");

  return <SignupPage i18n={{ lng, t }} />;
}
