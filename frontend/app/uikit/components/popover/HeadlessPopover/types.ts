import type { ReactNode, PropsWithChildren, MouseEvent, MutableRefObject } from "react";
import { TModifiers, TPlacement } from "@/app/uikit/components/tooltip";

export type TPopoverPosition = "left" | "center" | "right";

export type TPopoverProps = {
  classes?: TPopoverClasses;
  className?: string;
  dataTestId?: string;
  modifiers?: TModifiers;
  placement?: TPlacement;
  trigger: ReactNode | ReactNode[];
} & PropsWithChildren;

type TPopoverClasses = {
  popperContent?: string;
  popperElement?: string;
  referenceElement?: string;
};

export type THeadlessPopoverClose = (
  focusableElement?: HTMLElement | MutableRefObject<HTMLElement | null> | MouseEvent<HTMLElement>,
) => void;
