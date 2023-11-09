"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import type { FC } from "react";
import { ERoutes } from "../../../shared/enums";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/app/uikit/components/button";
import { notify } from "@/app/uikit/components/toast/utils";
import { createPath } from "../../../shared/utils";
import "./LoginForm.scss";

export const LoginForm: FC = () => {
  const { data: session, status } = useSession();
  const { t } = useTranslation("index");
  const isLoading = status === "loading";

  useEffect(() => {
    if (status != "loading" && session && session?.error) {
      notify.error({ title: session?.error });
    }
  }, [session, status]);

  if (session) {
    redirect(
      createPath({
        route: ERoutes.Root,
      }),
    );
  }

  return (
    <div className="LoginForm-Control">
      <Button
        className="LoginForm-Button"
        onClick={() => signIn("keycloak")}
        aria-disabled={isLoading}
      >
        {t("pages.login.service")}
      </Button>
    </div>
  );
};
