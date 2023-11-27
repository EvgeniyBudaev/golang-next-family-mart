import type { FC } from "react";
import { TIconProps } from "@/app/uikit/assets/icons/types";

export const CashIcon: FC<TIconProps> = ({ height = 24, width = 24, ...props }) => (
  <svg height={height} width={width} viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M3,6H21V18H3V6M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M7,8A2,2 0 0,1 5,10V14A2,2 0 0,1 7,16H17A2,2 0 0,1 19,14V10A2,2 0 0,1 17,8H7Z"
    />
  </svg>
);
