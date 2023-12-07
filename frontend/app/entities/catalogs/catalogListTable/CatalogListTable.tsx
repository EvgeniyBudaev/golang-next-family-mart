"use client";

import { forwardRef, memo, useMemo, useState } from "react";
import type { TCatalogList } from "@/app/api/adminPanel/catalogs/list";
import { useGetColumns } from "@/app/entities/catalogs/catalogListTable/hooks";
import type { TCatalogListItem } from "@/app/api/adminPanel/catalogs/list/types";
import type { TTableColumn } from "@/app/entities/catalogs/catalogListTable/types";
import { useTranslation } from "@/app/i18n/client";
import { EPermissions } from "@/app/shared/enums";
import { useTheme } from "@/app/shared/hooks";
import { checkPermission } from "@/app/shared/utils/permissions";
import { Icon } from "@/app/uikit/components/icon";
import {
  createColumnHelper,
  Table as UiTable,
  type TTableSortingProps,
} from "@/app/uikit/components/table";
import type { TTableRowActions } from "@/app/uikit/components/table/types";
import "./CatalogListTable.scss";

type TProps = {
  fieldsSortState: TTableSortingProps;
  isLoading?: boolean;
  list: TCatalogList;
  onDelete?: (alias: string) => void;
  onEdit?: (alias: string) => void;
  onChangePage: ({ selected }: { selected: number }) => void;
  onChangePageSize: (pageSize: number) => void;
};

const TableComponent = forwardRef<HTMLDivElement, TProps>(
  ({ fieldsSortState, isLoading, list, onDelete, onEdit, onChangePage, onChangePageSize }, ref) => {
    const { t } = useTranslation("index");
    // const { user } = useUser();
    const columnHelper = createColumnHelper<TCatalogListItem>();
    const columns = useGetColumns(columnHelper);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const { theme } = useTheme();

    const { content, countPages, limit, page, totalItems } = list;

    const settingsProps = useMemo(
      () => ({
        options: {
          hiddenColumns,
          setHiddenColumns,
          optionsCancelText: t("common.actions.cancel"),
          optionsChangeText: t("common.actions.apply"),
          optionsFieldHeader: t("common.table.options.fields"),
          optionsModalHeader: t("common.table.options.modal"),
          optionsSorting: {
            ascText: t("common.table.options.sorting.asc"),
            defaultText: t("common.table.options.sorting.default"),
            descText: t("common.table.options.sorting.desc"),
            hideColumnText: t("common.table.options.sorting.hide"),
          },
        },
      }),
      [hiddenColumns, t],
    );

    const handleAttributeEdit = ({ alias }: TTableColumn) => {
      onEdit?.(alias);
    };

    const handleAttributeDelete = ({ alias }: TTableColumn) => {
      onDelete?.(alias);
    };

    const rowActions: TTableRowActions<TTableColumn> = [
      {
        icon: <Icon type="Trash" />,
        title: t("common.actions.delete"),
        onClick: handleAttributeDelete,
        permission: [EPermissions.Admin],
      },
      {
        icon: <Icon type="Edit" />,
        title: t("common.actions.edit"),
        onClick: handleAttributeEdit,
        permission: [EPermissions.Admin],
      },
    ];

    return (
      <div ref={ref}>
        <UiTable<TCatalogListItem>
          columns={columns}
          currentPage={page}
          data={content ?? []}
          defaultPageSize={limit}
          getId={(row) => row.alias}
          isLoading={isLoading}
          messages={{ notFound: t("common.info.noData") }}
          onChangePageSize={onChangePageSize}
          onPageChange={onChangePage}
          pagesCount={countPages}
          rowActions={rowActions}
          settings={settingsProps}
          sorting={fieldsSortState}
          sticky={true}
          theme={theme}
          totalItems={totalItems}
          totalItemsTitle={t("pages.adminPanel.catalogList.table.header") ?? "Total attributes"}
        />
      </div>
    );
  },
);

TableComponent.displayName = "CatalogListTableComponent";

export const CatalogListTable = memo(TableComponent);
