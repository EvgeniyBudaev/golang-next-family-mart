import Link from "next/link";
import type { FC } from "react";
import { ERoutes } from "@/app/enums";
import { I18nProps } from "@/app/i18n/props";
import { SignupForm } from "@/app/pages/signupPage/signupForm";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import { createPath } from "@/app/utils";
import "./SignupPage.scss";

export const SignupPage: FC<I18nProps> = ({ i18n }) => {
  return (
    <section className="SignupPage">
      <div className="SignupPage-Inner">
        <div className="SignupPage-Content">
          <div className="SignupPage-Title">
            <Typography
              value={i18n.t("pages.signup.title")}
              variant={ETypographyVariant.TextH1Bold}
            />
          </div>
          <SignupForm />
          <div className="SignupPage-Login">
            <Typography
              value={i18n.t("pages.signup.haveAccount")}
              variant={ETypographyVariant.TextB3Regular}
            />
            <Link
              href={createPath({
                route: ERoutes.Login,
              })}
            >
              <Typography
                value={i18n.t("pages.signup.enter")}
                variant={ETypographyVariant.TextB3Regular}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
