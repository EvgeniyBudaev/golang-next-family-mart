import Link from "next/link";
import type { FC } from "react";
import { ERoutes } from "../../shared/enums";
import { I18nProps } from "@/app/i18n/props";
import { LoginForm } from "@/app/pages/loginPage/LoginForm";
import { Typography } from "@/app/uikit/components/typography";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import { createPath } from "../../shared/utils";
import "./LoginPage.scss";

export const LoginPage: FC<I18nProps> = ({ i18n }) => {
  return (
    <section className="LoginPage">
      <div className="LoginPage-Center">
        <div className="LoginPage-CenterContent">
          <div className="LoginPage-CenterContentTitle">
            <Typography
              value={i18n.t("pages.login.title")}
              variant={ETypographyVariant.TextH1Bold}
            />
          </div>
          <LoginForm />
          <div className="LoginPage-Signup">
            <Typography
              value={i18n.t("pages.login.noAccount")}
              variant={ETypographyVariant.TextB3Regular}
            />
            <Link
              href={createPath({
                route: ERoutes.Signup,
              })}
            >
              <Typography
                value={i18n.t("pages.login.signup")}
                variant={ETypographyVariant.TextB3Regular}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
