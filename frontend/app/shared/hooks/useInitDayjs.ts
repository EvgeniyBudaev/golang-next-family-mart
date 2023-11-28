"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/app/i18n/client";
import dayjs from "dayjs";

export const useInitDayjs = () => {
  const { i18n } = useTranslation("index");
  const isInitialized = useRef(false);

  if (!isInitialized.current) {
    isInitialized.current = true;
    dayjs.locale(i18n.language);
  }

  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);
};
