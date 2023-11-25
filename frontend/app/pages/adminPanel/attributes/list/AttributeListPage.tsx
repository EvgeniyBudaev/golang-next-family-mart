"use client";

import type { FC } from "react";
import { type TAttributeList } from "@/app/api/adminPanel/attributes/list";
import { AttributeListTable } from "@/app/entities/attributes/list";
import { ETableColumns } from "@/app/entities/attributes/list/enums";
import { useTranslation } from "@/app/i18n/client";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./AttributeListPage.scss";

type TProps = {
  attributeList: TAttributeList;
};

export const AttributeListPage: FC<TProps> = ({ attributeList }) => {
  const { t } = useTranslation("index");

  return (
    <section className="AttributeListPage">
      <div className="AttributeListPage-Header">
        <div className="AttributeListPage-Title">
          <Typography
            value={t("pages.adminPanel.attributeList.title")}
            variant={ETypographyVariant.TextH1Bold}
          />
        </div>
        <div className="AttributeListPage-HeaderControls"></div>
      </div>
      <AttributeListTable
        attributeList={attributeList}
        fieldsSortState={{
          columns: [ETableColumns.Alias, ETableColumns.Name],
          multiple: false,
          onChangeSorting: () => {},
        }}
        isLoading={false}
        onAttributeDelete={() => {}}
        onAttributeEdit={() => {}}
        onChangePage={() => {}}
        onChangePageSize={() => {}}
      />
    </section>
  );
};
