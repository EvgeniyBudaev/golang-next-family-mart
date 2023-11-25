import { forwardRef } from "react";
import type { ForwardedRef } from "react";
import type { Row, RowData } from "@tanstack/react-table";

import { TableRow } from "@/app/uikit/components/table/tableRow";
import { type TTableRowActions } from "@/app/uikit/components/table/types";
import "./TableBody.scss";

type TProps<TColumn extends object> = {
  rowActions?: TTableRowActions<TColumn>;
  rows: Row<RowData>[];
};

const TableBodyComponent = <T extends object>(
  { rowActions, rows }: TProps<T>,
  ref: ForwardedRef<HTMLTableSectionElement>,
) => {
  return (
    <tbody className="TableBody" ref={ref}>
      {rows.map((row) => {
        return <TableRow key={row.id} rowActions={rowActions} row={row} />;
      })}
    </tbody>
  );
};

export const TableBody = forwardRef(TableBodyComponent);
