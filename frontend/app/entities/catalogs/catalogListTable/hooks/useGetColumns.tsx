"use client";

import { useMemo } from "react";
import type { ColumnDef, ColumnHelper } from "@tanstack/react-table";

import { TCatalogListItem } from "@/app/api/adminPanel/catalogs/list/types";
import { ETableColumns } from "@/app/entities/catalogs/catalogListTable/enums";
import { useTranslation } from "@/app/i18n/client";
import { TableHeader } from "@/app/shared/components/table/tableHeader";
import { DateTime } from "@/app/uikit/components/dateTime";
import { ClientOnly } from "@/app/uikit/components/clientOnly";

type TUseGetColumns = (
  columnHelper: ColumnHelper<TCatalogListItem>,
) => ColumnDef<TCatalogListItem>[];

export const useGetColumns: TUseGetColumns = (columnHelper) => {
  const { t } = useTranslation("index");

  return useMemo(
    () =>
      [
        columnHelper.accessor(ETableColumns.Name, {
          id: ETableColumns.Name,
          header: () => <TableHeader>{t("table.columns.name")}</TableHeader>,
          minSize: 192,
        }),

        columnHelper.accessor(ETableColumns.Alias, {
          id: ETableColumns.Alias,
          header: () => <TableHeader>{t("table.columns.alias")}</TableHeader>,
          minSize: 192,
        }),

        columnHelper.accessor(ETableColumns.UpdatedAt, {
          id: ETableColumns.UpdatedAt,
          header: () => <TableHeader>{t("table.columns.updatedAt")}</TableHeader>,
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
      ].filter(Boolean) as ColumnDef<TCatalogListItem>[],
    [columnHelper, t],
  );
};
