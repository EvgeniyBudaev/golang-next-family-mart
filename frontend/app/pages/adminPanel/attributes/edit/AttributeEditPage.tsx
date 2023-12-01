import type { FC } from "react";
import { TAttributeDetail } from "@/app/api/adminPanel/attributes/detail/types";
import { TSelectableList } from "@/app/api/adminPanel/selectables/list/types";
import { I18nProps } from "@/app/i18n/props";
import { AttributeEditForm } from "@/app/pages/adminPanel/attributes/edit/attributeEditForm";
import { Selectables } from "@/app/pages/adminPanel/selectables";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./AttributeEditPage.scss";

type TProps = {
  attribute: TAttributeDetail;
  selectableList: TSelectableList;
} & I18nProps;

export const AttributeEditPage: FC<TProps> = ({ attribute, i18n, selectableList }) => {
  const isSelectableType = true;

  return (
    <section>
      <div className="AttributeEditPage-Title">
        <Typography
          value={i18n.t("pages.adminPanel.attributeEdit.title")}
          variant={ETypographyVariant.TextH1Bold}
        />
      </div>
      <AttributeEditForm attribute={attribute} />
      <Selectables attribute={attribute} selectableList={selectableList} />
    </section>
  );
};
