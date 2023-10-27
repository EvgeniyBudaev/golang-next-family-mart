import type { FC } from "react";
import { LoginForm } from "@/app/pages/loginPage/loginForm";
import { Typography } from "@/app/uikit/components/typography";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import "./LoginPage.scss";
import { I18nProps } from "@/app/i18n/props";

export const LoginPage: FC<I18nProps> = ({ i18n }) => {
  return (
    <div className="LoginPage">
      <div className="LoginPage-Center">
        <div className="LoginPage-CenterContent">
          <div className="LoginPage-CenterContentTitle">
            <Typography
              value={i18n.t("pages.login.title")}
              variant={ETypographyVariant.TextH1Bold}
            />
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};
