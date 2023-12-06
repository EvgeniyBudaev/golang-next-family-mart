import type { FC } from "react";
import { I18nProps } from "@/app/i18n/props";
import { CatalogAddForm } from "@/app/pages/adminPanel/catalogs/add/catalogAddForm";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./CatalogAddPage.scss";

export const CatalogAddPage: FC<I18nProps> = ({ i18n }) => {
  return (
    <section>
      <div className="CatalogAddPage-Title">
        <Typography
          value={i18n.t("pages.adminPanel.catalogAdd.title")}
          variant={ETypographyVariant.TextH1Bold}
        />
      </div>
      <CatalogAddForm />
    </section>
  );
};
