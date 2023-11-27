import type { FC } from "react";
import { TIconProps } from "@/app/uikit/assets/icons/types";

export const CardIcon: FC<TIconProps> = ({ height = 24, width = 24, ...props }) => (
  <svg height={height} width={width} viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"
    />
  </svg>
);
