"use client";

import clsx from "clsx";
import { memo } from "react";
import type { ChangeEvent, FC, ReactNode } from "react";
import { Icon } from "@/app/uikit/components/icon";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./Checkbox.scss";

export type TCheckboxProps = {
  checked?: boolean;
  children?: ReactNode;
  className?: string;
  dataTestId?: string;
  defaultChecked?: boolean;
  id: string;
  label: string;
  name?: string;
  nameGroup?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>, nameGroup?: string) => void;
  value?: string | readonly string[] | number | undefined;
};

const CheckboxComponent: FC<TCheckboxProps> = ({
  checked,
  children,
  className,
  dataTestId = "uikit__checkbox",
  defaultChecked,
  id,
  label,
  name,
  nameGroup,
  onChange,
  value,
  ...props
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event, nameGroup);
  };

  return (
    <div className={clsx("Checkbox-Wrapper", className)} data-testid={dataTestId}>
      <input
        className="Checkbox"
        defaultChecked={defaultChecked}
        id={id}
        type="checkbox"
        name={name}
        value={id}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
      {label && (
        <label className="Checkbox-Label" htmlFor={id}>
          <Icon className="Checkbox-Icon" type="Checkbox" />
          <Typography value={label} variant={ETypographyVariant.TextB3Regular} />
        </label>
      )}
      {children && <span className="Checkbox-Description">{children}</span>}
    </div>
  );
};

export const Checkbox = memo(CheckboxComponent);
