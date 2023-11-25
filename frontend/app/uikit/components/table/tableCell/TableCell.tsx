import type { ReactElement } from "react";
import type { Cell, RowData } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { DEFAULT_COLUMN_MIN_SIZE } from "../constants";
import "./TableCell.scss";

type TTableCellProps<TColumn extends object> = {
  cell: Cell<RowData, unknown>;
};

export const TableCell = <TColumn extends object>({
  cell,
}: TTableCellProps<TColumn>): ReactElement => {
  return (
    <td
      className="TableCell"
      key={cell.id}
      style={{
        width: cell.column.getSize(),
        minWidth: cell.column.columnDef?.minSize ?? DEFAULT_COLUMN_MIN_SIZE,
        maxWidth: cell.column.columnDef?.maxSize,
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};
