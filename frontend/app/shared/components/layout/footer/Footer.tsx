"use client";

import type { FC } from "react";
import { useTranslation } from "@/app/i18n/client";
import { NavLink } from "@/app/shared/components/navLink";
import { ERoutes } from "@/app/shared/enums";
import { Typography } from "@/app/uikit/components/typography";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import "./Footer.scss";

export const Footer: FC = () => {
  const { t } = useTranslation("index");

  return (
    <footer className="Footer">
      <div className="Footer-Inner">
        <div className="Footer-Info">
          <NavLink href={ERoutes.About} activeClassName="Footer-Text__isActive">
            <span className="Footer-Text">
              <Typography value={t("footer.about")} variant={ETypographyVariant.TextB3Regular} />
            </span>
          </NavLink>
          <NavLink href={ERoutes.Delivery} activeClassName="Footer-Text__isActive">
            <span className="Footer-Text">
              <Typography value={t("footer.shipping")} variant={ETypographyVariant.TextB3Regular} />
            </span>
          </NavLink>
          <NavLink href={ERoutes.Contacts} activeClassName="Footer-Text__isActive">
            <span className="Footer-Text">
              <Typography value={t("footer.contacts")} variant={ETypographyVariant.TextB3Regular} />
            </span>
          </NavLink>
        </div>
      </div>
    </footer>
  );
};
