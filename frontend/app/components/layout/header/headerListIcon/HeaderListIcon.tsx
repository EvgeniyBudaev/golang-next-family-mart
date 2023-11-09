"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import type { FC } from "react";
import { useTranslation } from "@/app/i18n/client";
import { ERoutes } from "@/app/shared/enums";
import { DropDown } from "@/app/uikit/components/dropdown";
import { Icon } from "@/app/uikit/components/icon";
import { Typography } from "@/app/uikit/components/typography";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import { createPath } from "@/app/shared/utils";
import "./HeaderListIcon.scss";
import { Avatar } from "@/app/uikit/components/avatar";

export const HeaderListIcon: FC = () => {
  const { data: session, status } = useSession();
  const { t } = useTranslation("index");
  const isSession = Boolean(session);
  console.log("session: ", session);
  const isAdmin = true;

  const handleRedirectAdminPanel = () => {};

  const handleLogout = () => {};

  return (
    <div className="HeaderListIcon">
      <div className="HeaderListIcon-Item">
        {isSession && (
          <div className="HeaderListIcon-AvatarDropDown">
            <DropDown>
              <DropDown.Button classes={{ dropDownButton: "" }}>
                <Avatar size={46} user={session?.user?.name} />
              </DropDown.Button>
              <DropDown.Panel classes={{ dropDownPanel: "HeaderListIcon-DropDownUser" }}>
                <ul className="HeaderListIcon-AvatarDropDown_Menu">
                  {isAdmin && (
                    <li
                      className="HeaderListIcon-AvatarDropDown_MenuItem"
                      onClick={handleRedirectAdminPanel}
                    >
                      <Icon
                        className="HeaderListIcon-AvatarDropDown_MenuItemIcon"
                        type="AdminPanel"
                      />
                      <div className="HeaderListIcon-AvatarDropDown_MenuItemText">
                        <Typography
                          value={t("header.adminPanel")}
                          variant={ETypographyVariant.TextB3Regular}
                        />
                      </div>
                    </li>
                  )}
                  <li className="HeaderListIcon-AvatarDropDown_MenuItem" onClick={handleLogout}>
                    <Icon className="HeaderListIcon-AvatarDropDown_MenuItemIcon" type="Exit" />
                    <div className="HeaderListIcon-AvatarDropDown_MenuItemText">
                      <Typography
                        value={t("header.exit")}
                        variant={ETypographyVariant.TextB3Regular}
                      />
                    </div>
                  </li>
                </ul>
              </DropDown.Panel>
            </DropDown>
          </div>
        )}

        {!isSession && (
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
              <Typography value={t("header.enter")} variant={ETypographyVariant.TextB3Regular} />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
