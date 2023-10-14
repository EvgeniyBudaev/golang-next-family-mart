"use client";
import { createElement } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { EColorText } from "@/app/uikit/components/colors";
import { TYPOGRAPHY_THEMES } from "@/app/uikit/components/typography/constants";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import { TTypographyColor } from "@/app/uikit/components/typography/types";

type TProps = {
  as?: string;
  color?: TTypographyColor;
  dataTestId?: string;
  value: string;
  variant?: `${ETypographyVariant}`;
};

export const Typography: FC<TProps> = ({
  as = "span",
  color = EColorText.Dark,
  dataTestId = "uikit__typography",
  value,
  variant = ETypographyVariant.TextB3Regular,
}) => {
  const { t } = useTranslation();
  const currentTheme = TYPOGRAPHY_THEMES({ color })[variant];

  return createElement(
    as,
    {
      className: currentTheme,
      "data-testid": dataTestId,
    },
    t(value),
  );
};
