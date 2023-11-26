"use client";

import clsx from "clsx";
import { memo } from "react";
import type { FC, ChangeEvent, KeyboardEvent, MouseEvent } from "react";

import { useTranslation } from "@/app/i18n/client";
import { EFormMethods } from "@/app/shared/form";
import { EFormFields } from "@/app/shared/components/search/searchingPanel/enums";
import { Icon } from "@/app/uikit/components/icon";
import "./SearchingPanel.scss";

type TProps = {
  className?: string;
  defaultSearch?: string;
  isActive?: boolean;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
  onFocus?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onSubmit?: (event: ChangeEvent<HTMLFormElement>) => void;
};

const Component: FC<TProps> = ({
  className,
  defaultSearch,
  isActive,
  onBlur,
  onClick,
  onFocus,
  onKeyDown,
  onSubmit,
}) => {
  const { t } = useTranslation("index");
  console.log("defaultSearch: ", defaultSearch);

  return (
    <div
      className={clsx("SearchingPanel", className, {
        SearchingPanel__active: isActive,
      })}
    >
      <form className="SearchingPanel-Form" method={EFormMethods.Get} onChange={onSubmit}>
        <div className="SearchingPanel-InputWrapper">
          <input
            autoComplete="off"
            className="SearchingPanel-Input"
            defaultValue={defaultSearch}
            name={EFormFields.Search}
            placeholder={t("common.actions.search") ?? "Search"}
            type="text"
            onBlur={onBlur}
            onClick={onClick}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
          />
        </div>
        <Icon className="SearchingPanel-Icon" type="Search" />
      </form>
    </div>
  );
};

export const SearchingPanel = memo(Component);
