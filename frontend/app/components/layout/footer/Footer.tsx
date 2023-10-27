import type { FC } from "react";

import { NavLink } from "@/app/components/navLink";
import { Typography } from "@/app/uikit/components/typography";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import { ERoutes } from "@/app/enums";
import "./Footer.scss";

export const Footer: FC = () => {
  return (
    <footer className="Footer">
      <div className="Footer-Inner">
        <div className="Footer-Info">
          <NavLink href={ERoutes.About} activeClassName="Footer-Text__isActive">
            <span className="Footer-Text">
              <Typography value="footer.about" variant={ETypographyVariant.TextB3Regular} />
            </span>
          </NavLink>
          <NavLink href={ERoutes.Delivery} activeClassName="Footer-Text__isActive">
            <span className="Footer-Text">
              <Typography value="footer.shipping" variant={ETypographyVariant.TextB3Regular} />
            </span>
          </NavLink>
          <NavLink href={ERoutes.Contacts} activeClassName="Footer-Text__isActive">
            <span className="Footer-Text">
              <Typography value="footer.contacts" variant={ETypographyVariant.TextB3Regular} />
            </span>
          </NavLink>
        </div>
      </div>
    </footer>
  );
};
