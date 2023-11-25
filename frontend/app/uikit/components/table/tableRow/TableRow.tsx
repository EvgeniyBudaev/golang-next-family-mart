import type { ReactElement } from "react";
import type { Row, RowData } from "@tanstack/react-table";

import { MoreActions } from "@/app/uikit/components/table/moreActions";
import { TableCell } from "@/app/uikit/components/table/tableCell";
import { TTableRowActions } from "@/app/uikit/components/table/types";
import "./TableRow.scss";

type TTableRowProps<TColumn extends object> = {
  rowActions?: TTableRowActions<TColumn>;
  row: Row<RowData>;
};

export const TableRow = <TColumn extends object>({
  rowActions,
  row,
}: TTableRowProps<TColumn>): ReactElement => {
  return (
    <tr className="TableRow" key={row.id}>
      {row.getVisibleCells().map((cell) => {
        return <TableCell cell={cell} key={cell.id} />;
      })}

      {!!rowActions?.length && <MoreActions rowActions={rowActions} row={row} />}
    </tr>
  );
};
