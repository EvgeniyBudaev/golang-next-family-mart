"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import type { FC } from "react";
import { useTranslation } from "@/app/i18n/client";
import { EPermissions, ERoutes } from "@/app/shared/enums";
import { useCheckPermission } from "@/app/shared/hooks";
import { createPath } from "@/app/shared/utils";
import { Avatar } from "@/app/uikit/components/avatar";
import { DropDown } from "@/app/uikit/components/dropdown";
import { Icon } from "@/app/uikit/components/icon";
import { notify } from "@/app/uikit/components/toast/utils";
import { Typography } from "@/app/uikit/components/typography";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import "./HeaderListIcon.scss";

async function keycloakSessionLogOut() {
  try {
    await fetch(`/api/auth/logout`, { method: "GET" });
  } catch (error) {
    notify.error({ title: error });
  }
}

export const HeaderListIcon: FC = () => {
  const checkPermission = useCheckPermission();
  const permissions = [EPermissions.Customer];
  const isPerm = checkPermission(permissions);
  console.log("isPerm: ", isPerm);

  const { data: session, status } = useSession();
  const { t } = useTranslation("index");
  const isSession = Boolean(session);
  console.log("session: ", session);
  const isAdmin = true;

  useEffect(() => {
    if (status != "loading" && session && session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/" });
    }
  }, [session, status]);

  const handleRedirectAdminPanel = () => {};

  const handleLogout = () => {
    keycloakSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
  };

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
