import { useState } from "react";
import type { HeaderGroup } from "@tanstack/react-table";

import { DEFAULT_COLUMN_MIN_SIZE } from "@/app/uikit/components/table/constants";
import { type TSortingColumnStateWithReset } from "@/app/uikit/components/table/tableHeader/types";
import { getInitialSortingColumnState } from "@/app/uikit/components/table/tableHeader/utils";
import { TableHeaderItem } from "@/app/uikit/components/table/tableHeaderItem";
import { type TTableSortingProps } from "@/app/uikit/components/table/types";
import "./TableHeader.scss";

type TProps<RowData extends object> = {
  headerGroups: HeaderGroup<RowData>[];
  hiddenColumns?: string[];
  optionsSorting?: {
    ascText?: string;
    descText?: string;
    hideColumnText?: string;
  };
  setHiddenColumns?: (hiddenColumns: string[]) => void;
  sorting?: TTableSortingProps;
};

export const TableHeader = <T extends object>({
  headerGroups,
  hiddenColumns,
  optionsSorting,
  setHiddenColumns,
  sorting,
}: TProps<T>) => {
  const [sortingState, setSortingState] = useState<
    TSortingColumnStateWithReset | Array<TSortingColumnStateWithReset> | null
  >(getInitialSortingColumnState(sorting));

  const handleChangeSorting = (
    value: TSortingColumnStateWithReset | Array<TSortingColumnStateWithReset> | null,
  ) => {
    if (!value) {
      setSortingState(null);
      sorting?.onChangeSorting();
      return;
    }

    if (Array.isArray(value) && sorting?.multiple) {
      setSortingState(value);
      sorting?.onChangeSorting(
        value.map((item) => ({
          sortProperty: item.sortProperty,
          sortDirection: item.sortDirection,
        })),
      );
      return;
    }

    const { sortDirection, sortProperty } = value as TSortingColumnStateWithReset;
    setSortingState(value as TSortingColumnStateWithReset);
    sorting?.onChangeSorting({
      sortProperty,
      sortDirection,
    });
  };

  return (
    <thead className="TableHeader-THead">
      {headerGroups.map((headerGroup) => (
        <tr className="TableHeader-TR" key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const hasSorting = sorting?.columns.includes(header.id);

            return (
              <th
                className="TableHeader-TH"
                key={header.id}
                style={{
                  width: header.column.getSize(),
                  minWidth: header.column.columnDef?.minSize ?? DEFAULT_COLUMN_MIN_SIZE,
                  maxWidth: header.column.columnDef?.maxSize,
                }}
              >
                <TableHeaderItem
                  hasSorting={hasSorting}
                  header={header}
                  hiddenColumns={hiddenColumns}
                  multiple={sorting?.multiple}
                  onChange={handleChangeSorting}
                  optionsSorting={optionsSorting}
                  setHiddenColumns={setHiddenColumns}
                  state={sortingState}
                />
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
};
