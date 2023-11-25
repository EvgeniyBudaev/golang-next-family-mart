"use client";

import clsx from "clsx";
import isNil from "lodash/isNil";
import { forwardRef, useCallback, useEffect, useMemo, useRef } from "react";
import type { ForwardedRef, ReactElement } from "react";
import { getCoreRowModel, RowData, useReactTable } from "@tanstack/react-table";
import type { VisibilityState } from "@tanstack/react-table";

import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_LIST } from "@/app/shared/constants/pagination";
import { Icon } from "@/app/uikit/components/icon";
import { Control } from "@/app/uikit/components/table/control";
import { ETablePlacement } from "@/app/uikit/components/table/enums";
import { NavigationPanel } from "@/app/uikit/components/table/navigationPanel";
import { TableBody } from "@/app/uikit/components/table/tableBody";
import { TableHeader } from "@/app/uikit/components/table/tableHeader";
import { TableLoader } from "@/app/uikit/components/table/tableLoader";
import { type TTableProps } from "@/app/uikit/components/table/types";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./Table.scss";

const TableComponent = <TColumn extends Record<string, any>>(
  props: TTableProps<TColumn>,
  ref: ForwardedRef<HTMLDivElement>,
): ReactElement => {
  const data = useMemo(() => props.data, [props.data]);
  const {
    className,
    columns,
    currentPage,
    dataTestId = "uikit__table",
    debug,
    defaultPageSize,
    isLoading = false,
    messages,
    onChangePageSize,
    onPageChange,
    onRowSelectionChange,
    pagesCount,
    pageSizeOptions,
    rowActions,
    rowSelection,
    settings,
    sorting,
    sticky,
    theme,
    totalItems,
    totalItemsTitle,
  } = props;
  const hasData = !!data.length;
  const hiddenColumns = settings?.options?.hiddenColumns ?? [];
  const tableRef = useRef<HTMLTableElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const columnVisibility = useMemo<VisibilityState | undefined>(
    () =>
      hiddenColumns?.reduce((acc, item) => {
        acc[item] = false;

        return acc;
      }, {} as VisibilityState),
    [hiddenColumns],
  );

  const table = useReactTable({
    data,
    state: {
      columnVisibility,
      rowSelection,
    },
    columns,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getRowId: props.getId ?? ((row: TColumn) => row.id),
    debugTable: debug,
  });

  const updateSpinnerPosition = useCallback(() => {
    if (isNil(tableRef.current) || isNil(loaderRef.current)) {
      return;
    }
    const boundingRect = tableRef.current.getBoundingClientRect();
    const visibleTop = Math.max(0, Math.min(window.innerHeight, boundingRect.y));
    const visibleBottom = Math.max(0, Math.min(window.innerHeight, boundingRect.bottom));
    const top = (visibleTop + visibleBottom) / 2 - boundingRect.y;
    loaderRef.current.style.top = `${top}px`;
  }, [tableRef, loaderRef]);

  useEffect(() => {
    document.addEventListener("scroll", updateSpinnerPosition);
    return () => document.removeEventListener("scroll", updateSpinnerPosition);
  }, [updateSpinnerPosition]);

  useEffect(() => {
    updateSpinnerPosition();
  });

  useEffect(() => {
    if (!sticky) return;

    function handleScroll() {
      if (isNil(wrapperRef.current)) return;
      const bbox = wrapperRef.current.getBoundingClientRect();
      wrapperRef.current.style.maxHeight = `${document.documentElement.clientHeight - bbox.top}px`;
    }

    handleScroll();
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [sticky, theme]);

  return (
    <div data-testid={dataTestId} ref={ref}>
      {hasData && pagesCount && (
        <NavigationPanel
          className="Table-NavigationPanel__top"
          currentPage={currentPage}
          defaultPageSize={!isNil(defaultPageSize) ? defaultPageSize : DEFAULT_PAGE_SIZE}
          dropdownPosition={ETablePlacement.Bottom}
          onChangePageSize={(pageSize: number) => onChangePageSize?.(pageSize)}
          onPageChange={onPageChange}
          pagesCount={pagesCount}
          pageSizeOptions={!isNil(pageSizeOptions) ? pageSizeOptions : DEFAULT_PAGE_SIZE_LIST}
          theme={theme}
        />
      )}
      <div className="Table-Head">
        <div>
          {" "}
          <Typography value={totalItemsTitle ?? ""} variant={ETypographyVariant.TextB2SemiBold} />
          &nbsp;<span className="Table-HeadCount">{hasData ? totalItems : 0}</span>
        </div>
        <div>{settings && <Control {...settings} columns={table.getAllLeafColumns()} />}</div>
      </div>

      {hasData ? (
        <div className="Table-Root" ref={ref}>
          <div className="Table-Wrapper" ref={wrapperRef}>
            {isLoading && <TableLoader ref={loaderRef} />}
            <table ref={tableRef} className={clsx("Table-Table", className)}>
              <TableHeader<RowData>
                headerGroups={table.getHeaderGroups()}
                hiddenColumns={settings?.options?.hiddenColumns}
                optionsSorting={settings?.options?.optionsSorting}
                setHiddenColumns={settings?.options?.setHiddenColumns}
                sorting={sorting}
              />
              <TableBody rowActions={rowActions} rows={table.getRowModel().rows} />
            </table>
          </div>
        </div>
      ) : (
        <div className="Table-NoData">
          <div className="Table-NoData_Info">
            <div className="Table-NoData_Info-Icon">
              <Icon type="Info" />
            </div>
            <div>
              <Typography value={messages?.notFound ?? ""} />
            </div>
          </div>
          <div className="Table-Root" ref={ref}>
            <div className="Table-Wrapper">{isLoading && <TableLoader ref={loaderRef} />}</div>
          </div>
        </div>
      )}
      {hasData && pagesCount && (
        <NavigationPanel
          currentPage={currentPage}
          defaultPageSize={!isNil(defaultPageSize) ? defaultPageSize : DEFAULT_PAGE_SIZE}
          dropdownPosition={ETablePlacement.Top}
          onChangePageSize={(pageSize: number) => onChangePageSize?.(pageSize)}
          onPageChange={onPageChange}
          pagesCount={pagesCount}
          pageSizeOptions={!isNil(pageSizeOptions) ? pageSizeOptions : DEFAULT_PAGE_SIZE_LIST}
          theme={theme}
        />
      )}
    </div>
  );
};

export const Table = forwardRef(TableComponent) as typeof TableComponent;
