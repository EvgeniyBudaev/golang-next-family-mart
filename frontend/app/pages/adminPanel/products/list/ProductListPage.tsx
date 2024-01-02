"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { FC } from "react";
import { type TProductList } from "@/app/api/adminPanel/products/list";
import { ProductListTable } from "@/app/entities/products/productListTable";
import { ETableColumns } from "@/app/entities/products/productListTable/enums";
import { useTranslation } from "@/app/i18n/client";
import { ProductModalDelete } from "@/app/pages/adminPanel/products/delete/productModalDelete";
import { SearchingPanel } from "@/app/shared/components/search/searchingPanel";
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "@/app/shared/constants/pagination";
import { ERoutes } from "@/app/shared/enums";
import { useTable } from "@/app/shared/hooks";
import { createPath } from "@/app/shared/utils";
import { ButtonLink } from "@/app/uikit/components/button/buttonLink";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./ProductListPage.scss";

type TProps = {
  list: TProductList;
};

export const ProductListPage: FC<TProps> = ({ list }) => {
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
      route: ERoutes.AdminProductEdit,
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
    <section className="ProductListPage">
      <div className="ProductListPage-Header">
        <div className="ProductListPage-Title">
          <Typography
            value={t("pages.adminPanel.productList.title")}
            variant={ETypographyVariant.TextH1Bold}
          />
        </div>
        <div className="ProductListPage-HeaderControls">
          <SearchingPanel
            className="ProductListPage-SearchingPanel"
            defaultSearch={defaultSearch}
            isActive={isSearchActive}
            onBlur={onSearchBlur}
            onClick={onSearchFocus}
            onFocus={onSearchFocus}
            onKeyDown={onSearchKeyDown}
            onSubmit={onSearch}
          />
          <ButtonLink className="ProductListPage-LinkButton" href="/admin/products/add">
            {t("common.actions.add")}
          </ButtonLink>
        </div>
      </div>
      <ProductListTable
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
      <ProductModalDelete uuid={uuid} isOpen={isOpenModalDelete} onClose={handleCloseModal} />
    </section>
  );
};
