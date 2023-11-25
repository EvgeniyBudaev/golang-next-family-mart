import clsx from "clsx";
import { memo } from "react";
import type { FC } from "react";

import { Pagination } from "@/app/uikit/components/pagination";
import { ETablePlacement } from "@/app/uikit/components/table/enums";
import { PageSize } from "@/app/uikit/components/table/pageSize";
import { ETheme } from "@/app/uikit/enums";
import "./NavigationPanel.scss";

type TProps = {
  className?: string;
  currentPage?: number;
  defaultPageSize: number;
  dropdownPosition?: ETablePlacement;
  onChangePageSize: (pageSize: number) => void;
  onPageChange?: ({ selected }: { selected: number }) => void;
  pagesCount?: number;
  pageSizeOptions: number[];
  theme?: ETheme;
};

const Component: FC<TProps> = ({
  className,
  currentPage,
  defaultPageSize,
  dropdownPosition,
  onChangePageSize,
  onPageChange,
  pagesCount,
  pageSizeOptions,
  theme,
}) => {
  return (
    <div className={clsx("NavigationPanel", className)}>
      <PageSize
        defaultPageSize={defaultPageSize}
        dropdownPosition={dropdownPosition}
        options={pageSizeOptions}
        onChangePageSize={onChangePageSize}
        theme={theme}
      />
      {currentPage && pagesCount && onPageChange && (
        <Pagination
          forcePage={currentPage - 1}
          pagesCount={pagesCount}
          onChange={onPageChange}
          theme={theme}
        />
      )}
      <div />
    </div>
  );
};

export const NavigationPanel = memo(Component);
