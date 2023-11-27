import type { FC } from "react";
import { TIconProps } from "@/app/uikit/assets/icons/types";

export const AttentionIcon: FC<TIconProps> = ({ height = 24, width = 24, ...props }) => (
  <svg
    height={height}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    {...props}
  >
    <path d="M10 19a9 9 0 110-18 9 9 0 010 18zm0-16a7 7 0 100 14 7 7 0 000-14zm0 4.5a1 1 0 110-2 1 1 0 010 2zm0 7.5a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"></path>
  </svg>
);
