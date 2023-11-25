import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ColumnDef, ColumnHelper } from "@tanstack/react-table";

import { TAttributeListItem } from "@/app/api/adminPanel/attributes/list/types";
import { ETableColumns } from "@/app/entities/attributes/list/enums";
import { TableHeader } from "@/app/uikit/components/table/tableHeader";

type TUseGetColumns = (
  columnHelper: ColumnHelper<TAttributeListItem>,
) => ColumnDef<TAttributeListItem>[];

export const useGetColumns: TUseGetColumns = (columnHelper) => {
  const { t } = useTranslation();

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
      ].filter(Boolean) as ColumnDef<TAttributeListItem>[],
    [columnHelper, t],
  );
};
