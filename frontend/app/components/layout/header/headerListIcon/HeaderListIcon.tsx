import Link from "next/link";
import type { FC } from "react";
import { ERoutes } from "@/app/enums";
import { Icon, Typography } from "@/app/uikit/components";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import { createPath } from "@/app/utils";
import "./HeaderListIcon.scss";

export const HeaderListIcon: FC = () => {
  return (
    <div className="HeaderListIcon">
      <div className="HeaderListIcon-Item">
        <Link
          className="HeaderListIcon-IconLink"
          href={createPath({
            route: ERoutes.Login,
          })}
        >
          <Icon className="HeaderListIcon-Icon" type="User" />
          <div className="HeaderListIcon-IconDescription">
            <Typography value="header.enter" variant={ETypographyVariant.TextB3Regular} />
          </div>
        </Link>
      </div>
    </div>
  );
};
