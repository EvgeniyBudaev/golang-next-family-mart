import type { FC } from "react";
import { TCatalogDetail } from "@/app/api/adminPanel/catalogs/detail/types";
import { I18nProps } from "@/app/i18n/props";
import { CatalogEditForm } from "@/app/pages/adminPanel/catalogs/edit/catalogEditForm";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./CatalogEditPage.scss";

type TProps = {
  catalog: TCatalogDetail;
} & I18nProps;

export const CatalogEditPage: FC<TProps> = ({ catalog, i18n }) => {
  return (
    <section>
      <div className="CatalogEditPage-Title">
        <Typography
          value={i18n.t("pages.adminPanel.catalogEdit.title")}
          variant={ETypographyVariant.TextH1Bold}
        />
      </div>
      <CatalogEditForm catalog={catalog} />
    </section>
  );
};
