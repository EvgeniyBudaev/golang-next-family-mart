import * as React from "react";
import clsx from "clsx";
import { ESelectTheme } from "../../enums";
import { DATA_TEST_ID } from "../../constants";
import type { TListBaseProps } from "../types";
import { STYLES } from "./constants";

const PrimaryListComponent: React.FC<TListBaseProps> = ({
  selectValue,
  onClickItem,
  options,
  theme = ESelectTheme.Primary,
  renderOption,
  size,
  className,
  isDisabledItemClick,
}) => {
  return (
    <div data-testid={`${DATA_TEST_ID}__list`}>
      {!!options.length &&
        options
          .filter((option) => !option.hide)
          .map((option, index) => {
            const isSelected = option.value === selectValue;

            return (
              <div
                key={`select-item-${option.value}-${index}`}
                className={clsx(
                  STYLES.itemList({ disabled: option?.disabled, isSelected, theme, size }),
                  className,
                )}
                onClick={isDisabledItemClick ? undefined : (event) => onClickItem(event, option)}
                data-testid={`${DATA_TEST_ID}__item`}
              >
                {renderOption ? (
                  renderOption(option, { isSelected })
                ) : (
                  <>
                    {option.prefixIcon}

                    {option.name}
                  </>
                )}
              </div>
            );
          })}
    </div>
  );
};

export const PrimaryList = React.memo(PrimaryListComponent);
