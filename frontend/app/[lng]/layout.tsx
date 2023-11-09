import { dir } from "i18next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";
import AuthStatus from "@/app/components/authStatus/authStatus";
import { Layout } from "@/app/components/layout";
import { ToastContainer } from "@/app/uikit/components/toast/toastContainer";
import { SessionProviderWrapper } from "@/app/shared/utils/auth";
import { useTranslation } from "../i18n";
import { I18nContextProvider } from "../i18n/context";

export const metadata: Metadata = {
  title: "FamilyMart",
  description: "FamilyMart online store",
};

export default async function RootLayout({
  children,
  params: { lng },
}: {
  children: ReactNode;
  params: { lng: string };
}) {
  const { t } = await useTranslation(lng, "index");

  return (
    <SessionProviderWrapper>
      <html lang={lng} dir={dir(lng)}>
        <body>
          <I18nContextProvider lng={lng}>
            <Layout i18n={{ lng, t }}>{children}</Layout>
            <ToastContainer />
            {/*<AuthStatus />*/}
          </I18nContextProvider>
        </body>
      </html>
    </SessionProviderWrapper>
  );
}
