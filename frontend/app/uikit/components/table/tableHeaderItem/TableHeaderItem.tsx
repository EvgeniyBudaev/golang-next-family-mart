import clsx from "clsx";
import isNil from "lodash/isNil";
import xor from "lodash/xor";
import { useQueryParams } from "@/app/shared/hooks/useQueryParams";
import { Fragment, useCallback } from "react";
import type { ReactElement } from "react";
import { Popover as UiPopover, Transition } from "@headlessui/react";
import { flexRender } from "@tanstack/react-table";
import type { Header } from "@tanstack/react-table";

import { Icon } from "@/app/uikit/components/icon";
import { POPOVER_POSITION_STYLES } from "@/app/uikit/components/popover";
import { ETableSortDirection, type TTableSortingHandleChange } from "@/app/uikit/components/table";
import { type TTableOptionsSorting } from "@/app/uikit/components/table/options";
import { type TSortingColumnStateWithReset } from "@/app/uikit/components/table/tableHeader";
import { usePopover } from "@/app/uikit/components/table/tableHeaderItem/hooks";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./TableHeaderItem.scss";

type TProps<T extends object> = {
  className?: string;
  hasSorting?: boolean;
  header: Header<T, unknown>;
  hiddenColumns?: string[];
  multiple?: boolean;
  onChange: (
    value: TSortingColumnStateWithReset | Array<TSortingColumnStateWithReset> | null,
  ) => void;
  optionsSorting?: TTableOptionsSorting;
  setHiddenColumns?: (hiddenColumns: string[]) => void;
  state: TSortingColumnStateWithReset | Array<TSortingColumnStateWithReset> | null;
};

export const TableHeaderItem = <T extends object>({
  hasSorting,
  header,
  hiddenColumns,
  multiple,
  onChange,
  optionsSorting,
  setHiddenColumns,
  state,
}: TProps<T>): ReactElement => {
  const headerId = header.id;
  const sortingState = multiple
    ? (state as Array<TSortingColumnStateWithReset>).find((item) => item.sortProperty === headerId)
    : (state as TSortingColumnStateWithReset);
  const isAlreadySorted = sortingState?.sortProperty === headerId;
  const hasColumnInArray = multiple && !!sortingState;
  const { queryParams } = useQueryParams();

  const { attributes, popoverPosition, setPopperElement, setReferenceElement, styles, triggerRef } =
    usePopover();

  const checkSortingSearchParams = () => {
    const sort = !isNil(queryParams) ? queryParams.get("sort") : undefined;
    const listSearchParams = sort && sort.split(",");
    const formattedListSearchParams =
      listSearchParams &&
      listSearchParams.map((item) => {
        const array = item.split("_");
        return {
          sortProperty: array[0],
          sortDirection: array[1].toUpperCase(),
        };
      });
    const findSearchParams =
      formattedListSearchParams &&
      formattedListSearchParams.find((item) => item.sortProperty === headerId);
    return findSearchParams ? findSearchParams.sortDirection : undefined;
  };

  const handleChange = ({
    sortProperty,
    sortDirection,
    shouldReset,
    close,
  }: TTableSortingHandleChange) => {
    close?.();
    if (sortingState && sortProperty === sortingState.sortProperty && shouldReset) {
      if (multiple) {
        onChange(
          (state as Array<TSortingColumnStateWithReset>).filter(
            (item) => item.sortProperty !== sortProperty,
          ),
        );
      } else {
        onChange(null);
      }

      return;
    }

    let preparedSortingParams: TSortingColumnStateWithReset | Array<TSortingColumnStateWithReset> =
      { sortProperty, sortDirection, shouldReset };

    if (multiple) {
      preparedSortingParams = hasColumnInArray
        ? (state as Array<TSortingColumnStateWithReset>).map((item) =>
            item.sortProperty === sortProperty
              ? { sortProperty, sortDirection, shouldReset }
              : item,
          )
        : (state as Array<TSortingColumnStateWithReset>).concat([
            { sortDirection, sortProperty, shouldReset },
          ]);
    }

    onChange(preparedSortingParams);
  };

  const handleHideColumn = useCallback(
    (close: any) => {
      setHiddenColumns?.(xor(hiddenColumns, [header.column.id]));
      close?.();
    },
    [header.column.id, hiddenColumns, setHiddenColumns],
  );

  const renderIconIndicator = () => {
    if (
      isAlreadySorted
        ? sortingState?.sortDirection === ETableSortDirection.Asc
        : checkSortingSearchParams() && checkSortingSearchParams() === ETableSortDirection.Asc
    ) {
      return (
        <div className="TableHeaderItem-IconIndicator">
          <Icon type="SortUp" />
        </div>
      );
    } else if (
      isAlreadySorted
        ? sortingState?.sortDirection === ETableSortDirection.Desc
        : checkSortingSearchParams() && checkSortingSearchParams() === ETableSortDirection.Desc
    ) {
      return (
        <div className="TableHeaderItem-IconIndicator">
          <Icon type="SortDown" />
        </div>
      );
    } else {
      return (
        <div className="TableHeaderItem-IconIndicator">
          <Icon type="Sorting" />
        </div>
      );
    }
  };

  const renderPopoverTrigger = () => {
    return (
      <div className="TableHeaderItem-Button">
        <div className="TableHeaderItem-ButtonText">
          <Typography
            value={
              header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())
            }
            variant={ETypographyVariant.TextB3Medium}
          />
        </div>
        {hasSorting && renderIconIndicator()}
      </div>
    );
  };

  const renderPopoverContent = (close: any) => {
    return (
      <ul className="TableHeaderItem-DropDownList">
        {hasSorting && (
          <>
            <li
              className={clsx("TableHeaderItem-DropDownListItem", {
                "TableHeaderItem-DropDownListItem__active":
                  sortingState?.sortDirection === ETableSortDirection.Asc ||
                  (checkSortingSearchParams() &&
                    checkSortingSearchParams() === ETableSortDirection.Asc),
              })}
              onClick={() =>
                handleChange({
                  sortProperty: headerId,
                  sortDirection: ETableSortDirection.Asc,
                  close,
                })
              }
            >
              <div className="TableHeaderItem-DropDownListItem-Icon">
                <Icon type="SortUp" />
              </div>
              <Typography
                value={optionsSorting?.ascText ?? ""}
                variant={ETypographyVariant.TextB3Regular}
              />
            </li>

            <li
              className={clsx("TableHeaderItem-DropDownListItem", {
                "TableHeaderItem-DropDownListItem__active":
                  sortingState?.sortDirection === ETableSortDirection.Desc ||
                  (checkSortingSearchParams() &&
                    checkSortingSearchParams() === ETableSortDirection.Desc),
              })}
              onClick={() =>
                handleChange({
                  sortProperty: headerId,
                  sortDirection: ETableSortDirection.Desc,
                  close,
                })
              }
            >
              <div className="TableHeaderItem-DropDownListItem-Icon">
                <Icon type="SortDown" />
              </div>
              <Typography
                value={optionsSorting?.descText ?? ""}
                variant={ETypographyVariant.TextB3Regular}
              />
            </li>

            <li
              className={clsx("TableHeaderItem-DropDownListItem", {
                "TableHeaderItem-DropDownListItem__active": !checkSortingSearchParams(),
              })}
              onClick={() =>
                handleChange({
                  sortProperty: headerId,
                  sortDirection: ETableSortDirection.Desc,
                  shouldReset: true,
                  close,
                })
              }
            >
              <div className="TableHeaderItem-DropDownListItem-Icon">
                <Icon type="Sorting" />
              </div>
              <Typography
                value={optionsSorting?.defaultText ?? ""}
                variant={ETypographyVariant.TextB3Regular}
              />
            </li>
          </>
        )}

        <li className="TableHeaderItem-DropDownListItem" onClick={() => handleHideColumn(close)}>
          <div className="TableHeaderItem-DropDownListItem-Icon">
            <Icon type="VisibilityOff" />
          </div>
          <Typography
            value={optionsSorting?.hideColumnText ?? ""}
            variant={ETypographyVariant.TextB3Regular}
          />
        </li>
      </ul>
    );
  };

  return (
    <UiPopover className="HeadlessPopover">
      <UiPopover.Button ref={setReferenceElement} className="HeadlessPopover-Button">
        <div className="HeadlessPopover-Trigger" ref={triggerRef}>
          {renderPopoverTrigger()}
        </div>
      </UiPopover.Button>
      <Transition as={Fragment}>
        <UiPopover.Panel
          ref={setPopperElement}
          style={styles.popper}
          className={clsx(
            "HeadlessPopover-Panel",
            `HeadlessPopover-Panel__${POPOVER_POSITION_STYLES[popoverPosition]}`,
          )}
          {...attributes.popper}
        >
          {({ close }) => (
            <Transition.Child
              as={Fragment}
              enter="HeadlessPopover-Transition__enter"
              enterFrom="HeadlessPopover-Transition__enterFrom"
              enterTo="HeadlessPopover-Transition__enterTo"
              leave="HeadlessPopover-Transition__leave"
              leaveFrom="HeadlessPopover-Transition__leaveFrom"
              leaveTo="HeadlessPopover-Transition__leaveTo"
            >
              <div className="HeadlessPopover-PanelContent">{renderPopoverContent(close)}</div>
            </Transition.Child>
          )}
        </UiPopover.Panel>
      </Transition>
    </UiPopover>
  );
};
