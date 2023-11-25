"use client";

import type { FC } from "react";
import { type TAttributeList } from "@/app/api/adminPanel/attributes/list";
import { AttributeListTable } from "@/app/entities/attributes/list";
import { ETableColumns } from "@/app/entities/attributes/list/enums";
import { useTranslation } from "@/app/i18n/client";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./AttributeListPage.scss";
import { useTable } from "@/app/shared/hooks";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/app/shared/constants/pagination";

type TProps = {
  attributeList: TAttributeList;
};

export const AttributeListPage: FC<TProps> = ({ attributeList }) => {
  const { t } = useTranslation("index");

  const handleAttributeDelete = (alias: string) => {};

  const handleAttributeEdit = (alias: string) => {};

  // const {
  //   defaultSearch,
  //   deleteModal,
  //   isSearchActive,
  //   onChangePage,
  //   onChangeSize,
  //   onClickDeleteIcon,
  //   onCloseDeleteModal,
  //   onDeleteSubmit,
  //   onSearch,
  //   onSearchBlur,
  //   onSearchFocus,
  //   onSearchKeyDown,
  //   onSortTableByProperty,
  // } = useTable({
  //   limitOption: attributeList?.limit ?? DEFAULT_PAGE_SIZE,
  //   onDelete: handleAttributeDelete,
  //   pageOption: attributeList?.currentPage ?? DEFAULT_PAGE,
  // });

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
