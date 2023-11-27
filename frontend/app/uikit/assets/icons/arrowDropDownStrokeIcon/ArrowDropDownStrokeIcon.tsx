import type { FC } from "react";
import { TIconProps } from "@/app/uikit/assets/icons/types";

export const ArrowDropDownStrokeIcon: FC<TIconProps> = ({ height = 24, width = 24, ...props }) => (
  <svg
    height={height}
    width={width}
    fill="none"
    stroke="currentColor"
    strokeWidth="24"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M98.9,184.7l1.8,2.1l136,156.5c4.6,5.3,11.5,8.6,19.2,8.6c7.7,0,14.6-3.4,19.2-8.6L411,187.1l2.3-2.6  c1.7-2.5,2.7-5.5,2.7-8.7c0-8.7-7.4-15.8-16.6-15.8v0H112.6v0c-9.2,0-16.6,7.1-16.6,15.8C96,179.1,97.1,182.2,98.9,184.7z" />
  </svg>
);
