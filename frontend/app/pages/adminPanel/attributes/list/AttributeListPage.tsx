"use client";

import { useRouter } from "next/navigation";
import type { FC } from "react";
import { type TAttributeList } from "@/app/api/adminPanel/attributes/list";
import { AttributeListTable } from "@/app/entities/attributes/attributeListTable";
import { ETableColumns } from "@/app/entities/attributes/attributeListTable/enums";
import { useTranslation } from "@/app/i18n/client";
import { SearchingPanel } from "@/app/shared/components/search/searchingPanel";
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "@/app/shared/constants/pagination";
import { ERoutes } from "@/app/shared/enums";
import { useTable } from "@/app/shared/hooks";
import { createPath } from "@/app/shared/utils";
import { ButtonLink } from "@/app/uikit/components/button/buttonLink";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./AttributeListPage.scss";

type TProps = {
  attributeList: TAttributeList;
};

export const AttributeListPage: FC<TProps> = ({ attributeList }) => {
  const router = useRouter();

  const { t } = useTranslation("index");

  const handleAttributeDelete = (alias: string) => {};

  const handleAttributeEdit = (alias: string) => {
    const path = createPath({
      route: ERoutes.AdminAttributeEdit,
      params: { alias },
    });
    router.push(path);
  };

  const {
    defaultSearch,
    deleteModal,
    isSearchActive,
    onChangeLimit,
    onChangePage,
    onClickDeleteIcon,
    onCloseDeleteModal,
    onDeleteSubmit,
    onSearch,
    onSearchBlur,
    onSearchFocus,
    onSearchKeyDown,
    onSortTableByProperty,
  } = useTable({
    limitOption: attributeList?.limit ?? DEFAULT_PAGE_LIMIT,
    onDelete: handleAttributeDelete,
    pageOption: attributeList?.page ?? DEFAULT_PAGE,
  });

  return (
    <section className="AttributeListPage">
      <div className="AttributeListPage-Header">
        <div className="AttributeListPage-Title">
          <Typography
            value={t("pages.adminPanel.attributeList.title")}
            variant={ETypographyVariant.TextH1Bold}
          />
        </div>
        <div className="AttributeListPage-HeaderControls">
          <SearchingPanel
            className="AttributeListPage-SearchingPanel"
            defaultSearch={defaultSearch}
            isActive={isSearchActive}
            onBlur={onSearchBlur}
            onClick={onSearchFocus}
            onFocus={onSearchFocus}
            onKeyDown={onSearchKeyDown}
            onSubmit={onSearch}
          />
          <ButtonLink className="AttributeListPage-LinkButton" href="/admin/attributes/add">
            {t("common.actions.add")}
          </ButtonLink>
        </div>
      </div>
      <AttributeListTable
        attributeList={attributeList}
        fieldsSortState={{
          columns: [
            ETableColumns.Alias,
            ETableColumns.Name,
            ETableColumns.Type,
            ETableColumns.UpdatedAt,
          ],
          multiple: false,
          onChangeSorting: onSortTableByProperty,
        }}
        isLoading={false}
        onAttributeDelete={onClickDeleteIcon}
        onAttributeEdit={handleAttributeEdit}
        onChangePage={onChangePage}
        onChangePageSize={onChangeLimit}
      />
    </section>
  );
};
