import type { FC } from "react";
import { TIconProps } from "@/app/uikit/assets/icons/types";

export const CheckboxIcon: FC<TIconProps> = (props) => (
  <svg viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1 3.88314L3 6L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
