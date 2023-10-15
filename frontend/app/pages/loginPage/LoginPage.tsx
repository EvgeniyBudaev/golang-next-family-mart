import type { FC } from "react";
import { LoginForm } from "@/app/pages/loginPage/loginForm";
import { Typography } from "@/app/uikit/components";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import "./LoginPage.scss";

export const LoginPage: FC = () => {
  return (
    <div className="LoginPage">
      <div className="LoginPage-Center">
        <div className="LoginPage-CenterContent">
          <div className="LoginPage-CenterContentTitle">
            <Typography value="pages.login.title" variant={ETypographyVariant.TextH1Bold} />
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};
