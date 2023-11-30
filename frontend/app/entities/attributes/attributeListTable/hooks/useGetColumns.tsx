"use client";

import { useMemo } from "react";
import type { ColumnDef, ColumnHelper } from "@tanstack/react-table";

import { TAttributeListItem } from "@/app/api/adminPanel/attributes/list/types";
import { ETableColumns } from "@/app/entities/attributes/attributeListTable/enums";
import { useTranslation } from "@/app/i18n/client";
import { TableHeader } from "@/app/shared/components/table/tableHeader";
import { DateTime } from "@/app/uikit/components/dateTime";
import { ClientOnly } from "@/app/uikit/components/clientOnly";

type TUseGetColumns = (
  columnHelper: ColumnHelper<TAttributeListItem>,
) => ColumnDef<TAttributeListItem>[];

export const useGetColumns: TUseGetColumns = (columnHelper) => {
  const { t } = useTranslation("index");

  return useMemo(
    () =>
      [
        columnHelper.accessor(ETableColumns.Name, {
          id: ETableColumns.Name,
          header: () => (
            <TableHeader>{t("pages.admin.attributes.table.columns.info.name")}</TableHeader>
          ),
          minSize: 192,
        }),

        columnHelper.accessor(ETableColumns.Alias, {
          id: ETableColumns.Alias,
          header: () => (
            <TableHeader>{t("pages.admin.attributes.table.columns.info.alias")}</TableHeader>
          ),
          minSize: 192,
        }),

        columnHelper.accessor(ETableColumns.Type, {
          id: ETableColumns.Type,
          header: () => (
            <TableHeader>{t("pages.admin.attributes.table.columns.info.type")}</TableHeader>
          ),
          minSize: 192,
        }),

        columnHelper.accessor(ETableColumns.UpdatedAt, {
          id: ETableColumns.UpdatedAt,
          header: () => (
            <TableHeader>{t("pages.admin.attributes.table.columns.info.updatedAt")}</TableHeader>
          ),
          cell: (data) => {
            const value = data.getValue();
            return (
              <ClientOnly>
                <DateTime value={value} />
              </ClientOnly>
            );
          },
          minSize: 192,
        }),
      ].filter(Boolean) as ColumnDef<TAttributeListItem>[],
    [columnHelper, t],
  );
};
