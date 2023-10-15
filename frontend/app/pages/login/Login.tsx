import type { FC } from "react";
import { Typography } from "@/app/uikit/components";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import "./Login.scss";

export const Login: FC = () => {
  return (
    <div className="Login">
      <div className="Login-Center">
        <div className="Login-CenterContent">
          <div className="Login-CenterContentTitle">
            <Typography value="pages.login.title" variant={ETypographyVariant.TextH1Bold} />
          </div>
        </div>
      </div>
    </div>
  );
};
