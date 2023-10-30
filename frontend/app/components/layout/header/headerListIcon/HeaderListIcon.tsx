import Link from "next/link";
import type { FC } from "react";
import { ERoutes } from "@/app/enums";
import { I18nProps } from "@/app/i18n/props";
import { Icon } from "@/app/uikit/components/icon";
import { Typography } from "@/app/uikit/components/typography";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import { createPath } from "@/app/utils";
import "./HeaderListIcon.scss";

export const HeaderListIcon: FC<I18nProps> = ({ i18n }) => {
  return (
    <div className="HeaderListIcon">
      <div className="HeaderListIcon-Item">
        <Link
          className="HeaderListIcon-IconLink"
          href={createPath(
            {
              route: ERoutes.Login,
            },
            // i18n.lng,
          )}
        >
          <Icon className="HeaderListIcon-Icon" type="User" />
          <div className="HeaderListIcon-IconDescription">
            <Typography value={i18n.t("header.enter")} variant={ETypographyVariant.TextB3Regular} />
          </div>
        </Link>
      </div>
    </div>
  );
};
