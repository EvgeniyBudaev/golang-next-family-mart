"use client";

import type { FC, PropsWithChildren, ReactNode } from "react";
import { useHydrated } from "@/app/uikit/hooks";

type TProps = {
  fallback?: ReactNode;
} & PropsWithChildren;

export const ClientOnly: FC<TProps> = ({ children, fallback = null }) => {
  return useHydrated() ? <>{children}</> : <>{fallback}</>;
};
