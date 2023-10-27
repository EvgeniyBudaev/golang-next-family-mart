"use client";

import clsx from "clsx";
import { memo } from "react";
import type { FC, DOMAttributes } from "react";
import type { TButton } from "./types";
import "./types";

export interface IButtonProps extends DOMAttributes<HTMLButtonElement> {
  className?: string;
  dataTestId?: string;
  type?: TButton;
  isDisabled?: boolean;
}

const ButtonComponent: FC<IButtonProps> = ({
  className,
  children,
  dataTestId = "uikit__button",
  type = "button",
  isDisabled = false,
  ...rest
}) => {
  return (
    <button
      className={clsx("Button", className, {
        Button__disabled: isDisabled,
      })}
      data-testid={dataTestId}
      disabled={isDisabled}
      type={type}
      {...rest}
    >
      <span>{children}</span>
    </button>
  );
};

export const Button = memo(ButtonComponent);
