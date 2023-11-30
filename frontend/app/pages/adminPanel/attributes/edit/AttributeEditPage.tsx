import type { FC } from "react";
import { TAttributeDetail } from "@/app/api/adminPanel/attributes/detail/types";
import { I18nProps } from "@/app/i18n/props";
import { AttributeEditForm } from "@/app/pages/adminPanel/attributes/edit/attributeEditForm/AttributeEditForm";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./AttributeEditPage.scss";

type TProps = {
  attribute: TAttributeDetail;
} & I18nProps;

export const AttributeEditPage: FC<TProps> = ({ attribute, i18n }) => {
  return (
    <section>
      <div className="AttributeEditPage-Title">
        <Typography
          value={i18n.t("pages.adminPanel.attributeEdit.title")}
          variant={ETypographyVariant.TextH1Bold}
        />
      </div>
      <AttributeEditForm attribute={attribute} />
    </section>
  );
};
