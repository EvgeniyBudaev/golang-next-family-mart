"use client";

import { createElement, memo, ReactNode } from "react";
import type { FC, PropsWithChildren } from "react";
import { EColorText } from "@/app/uikit/components/colors";
import { TYPOGRAPHY_THEMES } from "@/app/uikit/components/typography/constants";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import { TTypographyColor } from "@/app/uikit/components/typography/types";
import "./Typography.scss";

type TProps = {
  as?: string;
  color?: TTypographyColor;
  dataTestId?: string;
  value: ReactNode | JSX.Element | string | null;
  variant?: ETypographyVariant;
} & PropsWithChildren;

const TypographyComponent: FC<TProps> = ({
  as = "span",
  color = EColorText.Dark,
  dataTestId = "uikit__typography",
  value,
  variant = ETypographyVariant.TextB3Regular,
}) => {
  const currentTheme = TYPOGRAPHY_THEMES({ color })[variant];

  return createElement(
    as,
    {
      className: currentTheme,
      "data-testid": dataTestId,
    },
    value,
  );
};

export const Typography = memo(TypographyComponent);
