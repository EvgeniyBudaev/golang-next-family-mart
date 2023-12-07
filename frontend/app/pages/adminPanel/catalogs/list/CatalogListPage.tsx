"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { FC } from "react";
import { type TCatalogList } from "@/app/api/adminPanel/catalogs/list";
import { CatalogListTable } from "@/app/entities/catalogs/catalogListTable";
import { ETableColumns } from "@/app/entities/catalogs/catalogListTable/enums";
import { useTranslation } from "@/app/i18n/client";
import { CatalogModalDelete } from "@/app/pages/adminPanel/catalogs/delete/catalogModalDelete";
import { SearchingPanel } from "@/app/shared/components/search/searchingPanel";
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "@/app/shared/constants/pagination";
import { ERoutes } from "@/app/shared/enums";
import { useTable } from "@/app/shared/hooks";
import { createPath } from "@/app/shared/utils";
import { ButtonLink } from "@/app/uikit/components/button/buttonLink";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./CatalogListPage.scss";

type TProps = {
  list: TCatalogList;
};

export const CatalogListPage: FC<TProps> = ({ list }) => {
  const router = useRouter();
  const { t } = useTranslation("index");
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [alias, setAlias] = useState("");

  const uuid = useMemo(() => {
    return (list.content ?? []).find((item) => item.alias === alias)?.uuid ?? "";
  }, [alias]);

  const handleDelete = (alias: string) => {
    setAlias(alias);
    setIsOpenModalDelete(true);
  };

  const handleEdit = (alias: string) => {
    const path = createPath({
      route: ERoutes.AdminCatalogEdit,
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
    <section className="CatalogListPage">
      <div className="CatalogListPage-Header">
        <div className="CatalogListPage-Title">
          <Typography
            value={t("pages.adminPanel.catalogList.title")}
            variant={ETypographyVariant.TextH1Bold}
          />
        </div>
        <div className="CatalogListPage-HeaderControls">
          <SearchingPanel
            className="CatalogListPage-SearchingPanel"
            defaultSearch={defaultSearch}
            isActive={isSearchActive}
            onBlur={onSearchBlur}
            onClick={onSearchFocus}
            onFocus={onSearchFocus}
            onKeyDown={onSearchKeyDown}
            onSubmit={onSearch}
          />
          <ButtonLink className="CatalogListPage-LinkButton" href="/admin/catalogs/add">
            {t("common.actions.add")}
          </ButtonLink>
        </div>
      </div>
      <CatalogListTable
        fieldsSortState={{
          columns: [ETableColumns.Alias, ETableColumns.Name, ETableColumns.UpdatedAt],
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
      <CatalogModalDelete uuid={uuid} isOpen={isOpenModalDelete} onClose={handleCloseModal} />
    </section>
  );
};
