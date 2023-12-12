"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FC } from "react";
import { type TAttributeList } from "@/app/api/adminPanel/attributes/list";
import { AttributeListTable } from "@/app/entities/attributes/attributeListTable";
import { ETableColumns } from "@/app/entities/attributes/attributeListTable/enums";
import { useTranslation } from "@/app/i18n/client";
import { AttributeModalDelete } from "@/app/pages/adminPanel/attributes/delete/attributeModalDelete";
import { SearchingPanel } from "@/app/shared/components/search/searchingPanel";
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "@/app/shared/constants/pagination";
import { ERoutes } from "@/app/shared/enums";
import { useTable } from "@/app/shared/hooks";
import { createPath } from "@/app/shared/utils";
import { ButtonLink } from "@/app/uikit/components/button/buttonLink";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./AttributeListPage.scss";

type TProps = {
  list: TAttributeList;
};

export const AttributeListPage: FC<TProps> = ({ list }) => {
  const router = useRouter();
  const { t } = useTranslation("index");
  const [attributeUuid, setAttributeUuid] = useState("");
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);

  const handleDelete = (alias: string) => {
    const uuid = (list.content ?? []).find((item) => item.alias === alias)?.uuid ?? "";
    setAttributeUuid(uuid);
    setIsOpenModalDelete(true);
  };

  const handleEdit = (alias: string) => {
    const path = createPath({
      route: ERoutes.AdminAttributeEdit,
      params: { alias },
    });
    router.push(path);
  };

  const handleCloseModal = () => {
    setIsOpenModalDelete(false);
  };

  const {
    defaultSearch,
    isSearchActive,
    onChangeLimit,
    onChangePage,
    onSearch,
    onSearchBlur,
    onSearchFocus,
    onSearchKeyDown,
    onSortTableByProperty,
  } = useTable({
    limitOption: list?.limit ?? DEFAULT_PAGE_LIMIT,
    pageOption: list?.page ?? DEFAULT_PAGE,
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
        list={list}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onChangePage={onChangePage}
        onChangePageSize={onChangeLimit}
      />
      <AttributeModalDelete
        isOpen={isOpenModalDelete}
        onClose={handleCloseModal}
        uuid={attributeUuid}
      />
    </section>
  );
};
