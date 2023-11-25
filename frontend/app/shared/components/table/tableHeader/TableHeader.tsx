import clsx from "clsx";
import type { FC, ReactElement, ReactNode } from "react";
import { ETablePlacement } from "@/app/uikit/components/table/enums";
import { Tooltip, TPlacement } from "@/app/uikit/components/tooltip";
import "./TableHeader.scss";

type TProps = {
  children?: ReactNode;
  info?: string | ReactElement;
  placement?: TPlacement;
};

export const TableHeader: FC<TProps> = ({ children, info, placement = ETablePlacement.Top }) => {
  return (
    <div className={clsx("TableHeader", { "TableHeader-CursorHelp": info })}>
      {info ? (
        <Tooltip message={info} placement={placement}>
          {children}
        </Tooltip>
      ) : (
        children
      )}
    </div>
  );
};
