"use client";

import type { FC } from "react";
import { useInitDayjs } from "@/app/shared/hooks";

export const InitClient: FC = () => {
  useInitDayjs();
  return null;
};
