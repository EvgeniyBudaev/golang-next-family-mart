import { createContext } from "react";
import type { RefObject } from "react";

export type TDropDownState = {
  isDropDownOpen?: boolean;
  onClickButtonDropDown?: () => void;
  refButtonDropDown?: RefObject<HTMLDivElement | null>;
  refPanelDropDown?: RefObject<HTMLDivElement | null>;
};

export const DropDownContext = createContext<TDropDownState | null>(null);
export const DropDownProvider = DropDownContext.Provider;
