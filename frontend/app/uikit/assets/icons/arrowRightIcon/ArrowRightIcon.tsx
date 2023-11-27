import type { FC } from "react";
import { TIconProps } from "@/app/uikit/assets/icons/types";

export const ArrowRightIcon: FC<TIconProps> = ({ height = 24, width = 24, ...props }) => (
  <svg
    height={height}
    width={width}
    viewBox="0 0 8 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M0 14.5697L1.21337 16L8 8L1.21337 0L0 1.4303L5.57326 8L0 14.5697Z" />
  </svg>
);
