import type { FC } from "react";
import { TDictCatalogListItem } from "@/app/api/dict/catalogs";
import { I18nProps } from "@/app/i18n/props";
import { ProductAddForm } from "@/app/pages/adminPanel/products/add/productAddForm";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./ProductAddPage.scss";

type TProps = {
  dictCatalogList: TDictCatalogListItem[];
} & I18nProps;

export const ProductAddPage: FC<TProps> = ({ dictCatalogList, i18n }) => {
  return (
    <section>
      <div className="ProductAddPage-Title">
        <Typography
          value={i18n.t("pages.adminPanel.productAdd.title")}
          variant={ETypographyVariant.TextH1Bold}
        />
      </div>
      <ProductAddForm dictCatalogList={dictCatalogList} />
    </section>
  );
};
