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
import { AttributeModalDelete } from "@/app/pages/adminPanel/attributes/delete/attributeModalDelete";
import { useMemo, useState } from "react";

type TProps = {
  attributeList: TAttributeList;
};

export const AttributeListPage: FC<TProps> = ({ attributeList }) => {
  const router = useRouter();
  const { t } = useTranslation("index");
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [attributeAlias, setAttributeAlias] = useState("");

  const attributeUuid = useMemo(() => {
    return (attributeList.content ?? []).find((item) => item.alias === attributeAlias)?.uuid ?? "";
  }, [attributeAlias]);

  const handleAttributeDelete = (alias: string) => {
    setAttributeAlias(alias);
    setIsOpenModalDelete(true);
  };

  const handleAttributeEdit = (alias: string) => {
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
    limitOption: attributeList?.limit ?? DEFAULT_PAGE_LIMIT,
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
        onAttributeDelete={handleAttributeDelete}
        onAttributeEdit={handleAttributeEdit}
        onChangePage={onChangePage}
        onChangePageSize={onChangeLimit}
      />
      <AttributeModalDelete
        attributeUuid={attributeUuid}
        isOpen={isOpenModalDelete}
        onClose={handleCloseModal}
      />
    </section>
  );
};
