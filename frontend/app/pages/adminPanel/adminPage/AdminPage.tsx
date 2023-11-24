import { FC } from "react";
import { I18nProps } from "@/app/i18n/props";
import "./AdminPage.scss";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";

export const AdminPage: FC<I18nProps> = ({ i18n }) => {
  return (
    <section className="AdminPage">
      <Typography value={i18n.t("pages.admin.title")} variant={ETypographyVariant.TextH1Bold} />
    </section>
  );
};
