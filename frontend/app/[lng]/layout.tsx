import { dir } from "i18next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "@/app/components/layout";
import { ToastContainer } from "@/app/uikit/components/toast/toastContainer";
import { useTranslation } from "../i18n";
import { I18nContextProvider } from "../i18n/context";

export const metadata: Metadata = {
  title: "FamilyMart",
  description: "FamilyMart online store",
};

export default async function RootLayout({ children, params: { lng } }: {
  children: ReactNode,
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, "index");

  return (
    <html lang={lng} dir={dir(lng)}>
    <body>
    <I18nContextProvider lng={lng}>
      <Layout i18n={{ lng, t }}>{children}</Layout>
      <ToastContainer />
    </I18nContextProvider>
    </body>
    </html>
  );
}
