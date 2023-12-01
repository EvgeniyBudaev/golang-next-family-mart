"use client";

import { forwardRef, memo, useMemo, useState } from "react";
import { type TSelectableList } from "@/app/api/adminPanel/selectables/list/types";
import { useGetColumns } from "@/app/entities/attributes/selectableListTable/hooks";
import type { TSelectableListItem } from "@/app/api/adminPanel/selectables/list/types";
import type { TTableColumn } from "@/app/entities/attributes/selectableListTable/types";
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
import "./SelectableListTable.scss";

type TProps = {
  fieldsSortState: TTableSortingProps;
  isLoading?: boolean;
  onChangePage: ({ selected }: { selected: number }) => void;
  onChangePageSize: (pageSize: number) => void;
  onSelectableDelete?: (alias: string) => void;
  onSelectableEdit?: (alias: string) => void;
  selectableList: TSelectableList;
};

const TableComponent = forwardRef<HTMLDivElement, TProps>(
  (
    {
      fieldsSortState,
      isLoading,
      onChangePage,
      onChangePageSize,
      onSelectableDelete,
      onSelectableEdit,
      selectableList,
    },
    ref,
  ) => {
    const { t } = useTranslation("index");
    // const { user } = useUser();
    const columnHelper = createColumnHelper<TSelectableListItem>();
    const columns = useGetColumns(columnHelper);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const { theme } = useTheme();

    const { content, countPages, limit, page, totalItems } = selectableList;

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

    const handleSelectableEdit = ({ alias }: TTableColumn) => {
      onSelectableEdit?.(alias);
    };

    const handleSelectableDelete = ({ alias }: TTableColumn) => {
      onSelectableDelete?.(alias);
    };

    const rowActions: TTableRowActions<TTableColumn> = [
      {
        icon: <Icon type="Trash" />,
        title: t("common.actions.delete"),
        onClick: handleSelectableDelete,
        permission: [EPermissions.Admin],
      },
      {
        icon: <Icon type="Edit" />,
        title: t("common.actions.edit"),
        onClick: handleSelectableEdit,
        permission: [EPermissions.Admin],
      },
    ];
    // .filter(({ permission }) => checkPermission(user?.permissions ?? null, permission));

    return (
      <div ref={ref}>
        <UiTable<TSelectableListItem>
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
          totalItemsTitle={t("pages.adminPanel.selectableList.table.header") ?? "Total selectables"}
        />
      </div>
    );
  },
);

TableComponent.displayName = "SelectableListTableComponent";

export const SelectableListTable = memo(TableComponent);
