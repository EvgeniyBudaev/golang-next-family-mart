"use client";

import { PropsWithChildren, createContext } from "react";

export const I18nContext = createContext({ lng: "" });

export const I18nContextProvider = ({ lng, children }: { lng: string } & PropsWithChildren) => {
  return <I18nContext.Provider value={{ lng }}>{children}</I18nContext.Provider>;
};
