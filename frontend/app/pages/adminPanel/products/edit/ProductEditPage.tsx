import type { FC } from "react";
import { TProductDetail } from "@/app/api/adminPanel/products/detail/types";
import { I18nProps } from "@/app/i18n/props";
import { ProductEditForm } from "@/app/pages/adminPanel/products/edit/productEditForm";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./ProductEditPage.scss";

type TProps = {
  product: TProductDetail;
} & I18nProps;

export const ProductEditPage: FC<TProps> = ({ product, i18n }) => {
  return (
    <section>
      <div className="ProductEditPage-Title">
        <Typography
          value={i18n.t("pages.adminPanel.productEdit.title")}
          variant={ETypographyVariant.TextH1Bold}
        />
      </div>
      <ProductEditForm product={product} />
    </section>
  );
};
