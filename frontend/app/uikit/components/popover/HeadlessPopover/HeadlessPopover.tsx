"use client";

import clsx from "clsx";
import { memo } from "react";
import type { FC } from "react";
import { Popover as UiPopover } from "@headlessui/react";
import { TPopoverProps } from "@/app/uikit/components/popover/HeadlessPopover/types";
import { HeadlessPopoverContent } from "@/app/uikit/components/popover/HeadlessPopover/HeadlessPopoverContent";
import "./HeadlessPopover.scss";

const PopoverComponent: FC<TPopoverProps> = (props) => {
  const { className, dataTestId = "uikit__headless-popover", ...rest } = props;
  return (
    <UiPopover className={clsx("HeadlessPopover", className)} data-testid={dataTestId}>
      {({ open, close }) => <HeadlessPopoverContent {...rest} open={open} close={close} />}
    </UiPopover>
  );
};

export const HeadlessPopover = memo(PopoverComponent) as typeof PopoverComponent;
