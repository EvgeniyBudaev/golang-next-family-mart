"use client";

import dayjs from "dayjs";
import "dayjs/locale/ru";
import utc from "dayjs/plugin/utc";
import { useState, useEffect } from "react";
import { useTranslation } from "@/app/i18n/client";

dayjs.extend(utc);

export type TDayjs = typeof dayjs;

export function useDayjs(): { dayjs: TDayjs } {
  const { i18n } = useTranslation("index");
  const [dateState, setDateState] = useState({ dayjs });

  useEffect(() => {
    setDateState({ dayjs });
  }, [i18n.language]);

  return dateState;
}
