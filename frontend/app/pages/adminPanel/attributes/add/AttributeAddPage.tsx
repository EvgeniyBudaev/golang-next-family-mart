import type { FC } from "react";
import { I18nProps } from "@/app/i18n/props";
import { AttributeAddForm } from "@/app/pages/adminPanel/attributes/add/attributeAddForm";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./AttributeAddPage.scss";

export const AttributeAddPage: FC<I18nProps> = ({ i18n }) => {
  return (
    <section>
      <div className="AttributeAddPage-Title">
        <Typography
          value={i18n.t("pages.adminPanel.attributeAdd.title")}
          variant={ETypographyVariant.TextH1Bold}
        />
      </div>
      <AttributeAddForm />
    </section>
  );
};
