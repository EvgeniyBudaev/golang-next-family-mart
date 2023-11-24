import { FC } from "react";
import { I18nProps } from "@/app/i18n/props";
import { createPath } from "@/app/shared/utils";
import { ERoutes } from "@/app/shared/enums";
import { ButtonLink } from "@/app/uikit/components/button/buttonLink";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./AdminPage.scss";

export const AdminPage: FC<I18nProps> = ({ i18n }) => {
  return (
    <section className="AdminPage">
      <Typography
        value={i18n.t("pages.adminPanel.title")}
        variant={ETypographyVariant.TextH1Bold}
      />
      <div>
        <ButtonLink
          href={createPath({
            route: ERoutes.AdminAttributeAdd,
          })}
        >
          Атрибуты
        </ButtonLink>
      </div>
    </section>
  );
};
