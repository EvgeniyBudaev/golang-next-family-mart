"use client";

import { useMemo } from "react";
import type { ColumnDef, ColumnHelper } from "@tanstack/react-table";
import { TSelectableListItem } from "@/app/api/adminPanel/selectables/list/types";
import { ETableColumns } from "@/app/entities/attributes/selectableListTable/enums";
import { useTranslation } from "@/app/i18n/client";
import { TableHeader } from "@/app/shared/components/table/tableHeader";
import { DateTime } from "@/app/uikit/components/dateTime";
import { ClientOnly } from "@/app/uikit/components/clientOnly";

type TUseGetColumns = (
  columnHelper: ColumnHelper<TSelectableListItem>,
) => ColumnDef<TSelectableListItem>[];

export const useGetColumns: TUseGetColumns = (columnHelper) => {
  const { t } = useTranslation("index");

  return useMemo(
    () =>
      [
        columnHelper.accessor(ETableColumns.Id, {
          id: ETableColumns.Id,
          header: () => (
            <TableHeader>{t("pages.admin.selectables.table.columns.info.id")}</TableHeader>
          ),
          minSize: 192,
        }),

        columnHelper.accessor(ETableColumns.AttributeId, {
          id: ETableColumns.AttributeId,
          header: () => (
            <TableHeader>{t("pages.admin.selectables.table.columns.info.attributeId")}</TableHeader>
          ),
          minSize: 192,
        }),

        columnHelper.accessor(ETableColumns.Uuid, {
          id: ETableColumns.Uuid,
          header: () => (
            <TableHeader>{t("pages.admin.selectables.table.columns.info.uuid")}</TableHeader>
          ),
          minSize: 192,
        }),

        columnHelper.accessor(ETableColumns.Value, {
          id: ETableColumns.Value,
          header: () => (
            <TableHeader>{t("pages.admin.selectables.table.columns.info.value")}</TableHeader>
          ),
          minSize: 192,
        }),

        columnHelper.accessor(ETableColumns.UpdatedAt, {
          id: ETableColumns.UpdatedAt,
          header: () => (
            <TableHeader>{t("pages.admin.selectables.table.columns.info.updatedAt")}</TableHeader>
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
      ].filter(Boolean) as ColumnDef<TSelectableListItem>[],
    [columnHelper, t],
  );
};
