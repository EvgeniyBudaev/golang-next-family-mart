import { useCallback } from "react";
import { ETheme } from "@/app/uikit/enums";

export const useTheme = () => {
  const handleChangeTheme = useCallback((theme: ETheme) => {}, []);

  return {
    onChangeTheme: handleChangeTheme,
    theme: ETheme.Light,
  };
};
