"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import type { FC } from "react";
import { useTranslation } from "@/app/i18n/client";
import { EPermissions, ERoutes } from "@/app/shared/enums";
import { useCheckPermission, useSessionNext } from "@/app/shared/hooks";
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
  const isPermissions = checkPermission([EPermissions.Admin]);
  const { data: session, status } = useSessionNext();
  const { t } = useTranslation("index");
  const isSession = Boolean(session);

  useEffect(() => {
    if (status != "loading" && session && session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/" });
    }
  }, [session, status]);

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
                <div className="HeaderListIcon-AvatarDropDown_Menu">
                  {isPermissions && (
                    <Link
                      className="HeaderListIcon-AvatarDropDown_MenuItem"
                      href={createPath({
                        route: ERoutes.AdminPanel,
                      })}
                      // onClick={handleRedirectAdminPanel}
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
                    </Link>
                  )}
                  <div className="HeaderListIcon-AvatarDropDown_MenuItem" onClick={handleLogout}>
                    <Icon className="HeaderListIcon-AvatarDropDown_MenuItemIcon" type="Exit" />
                    <div className="HeaderListIcon-AvatarDropDown_MenuItemText">
                      <Typography
                        value={t("header.exit")}
                        variant={ETypographyVariant.TextB3Regular}
                      />
                    </div>
                  </div>
                </div>
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
