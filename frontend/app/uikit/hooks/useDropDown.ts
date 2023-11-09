import isNil from "lodash/isNil";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DropDownContext } from "@/app/uikit/context";
import type { TDropDownState } from "@/app/uikit/context";

export const useDropDownContext = (): TDropDownState | null => {
  return useContext(DropDownContext);
};

type TUseDropDown = () => TDropDownState;

export const useDropDown: TUseDropDown = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const refButtonDropDown = useRef<HTMLDivElement | null>(null);
  const refPanelDropDown = useRef<HTMLDivElement | null>(null);

  const handleClickButtonDropDown = useCallback(() => {
    setIsDropDownOpen((prevState?: boolean) => !prevState);
  }, []);

  const handleClickOutsideDropDown = useCallback(
    (event: MouseEvent) => {
      if (
        isDropDownOpen &&
        !isNil(refButtonDropDown) &&
        !isNil(refButtonDropDown?.current) &&
        event.target instanceof HTMLElement &&
        !refButtonDropDown.current.contains(event.target)
      ) {
        if (
          !isNil(refPanelDropDown) &&
          !isNil(refPanelDropDown.current) &&
          !refPanelDropDown.current.contains(event.target)
        ) {
          setIsDropDownOpen((prevState: boolean) => (prevState ? false : prevState));
        }
      }
    },
    [isDropDownOpen],
  );

  const handleScroll = useCallback(() => {
    setIsDropDownOpen((prevState: boolean) => (prevState ? false : prevState));
  }, []);

  useEffect(() => {
    window.addEventListener("click", handleClickOutsideDropDown);
    return () => {
      window.removeEventListener("click", handleClickOutsideDropDown);
    };
  });

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return useMemo(() => {
    return {
      isDropDownOpen,
      onClickButtonDropDown: handleClickButtonDropDown,
      refButtonDropDown,
      refPanelDropDown,
    };
  }, [isDropDownOpen, handleClickButtonDropDown]);
};
